import {StackConfig} from "../definitions/stack-config";
import {ConfigStack} from "@smorken/cdk-utils";
import {CodeStarSourceProps} from "../definitions/source";
import {CodePipelineCodeStarSource} from "../pipeline/code-pipeline-code-star-source";
import {Repositories} from "../factories/repositories";
import {CodePipelinePipeline, CodePipelinePipelineProps} from "../pipeline/code-pipeline-pipeline";
import {CodePipelineEnvStageProps, CodePipelineEnvStages} from "../pipeline/code-pipeline-env-stages";
import {CodePipelineSynthStep} from "../pipeline/code-pipeline-synth-step";
import {CodePipelineStackPermissions} from "../permissions/code-pipeline-stack-permissions";
import {CodePipelineEcrSteps, CodePipelineEcrStepsProps} from "../pipeline/code-pipeline-ecr-steps";
import {Wave} from "@aws-cdk/pipelines";
import {NotificationTargets} from "../pipeline/notification-targets";

export class CodePipelineStack<T extends StackConfig> extends ConfigStack<T> {
    cachedName?: string;

    exec() {
        const configParam = this.configFetchStore.configParamStore.fetchStringAsPlaceholder(this.configFetchStore.paramName);
        const repositories = this.createRepositories();
        const pipelineSource = this.createCodeStarSource(<CodeStarSourceProps>this.config.Parameters.sourceProps);
        const synthStep = this.createSynthStep(pipelineSource);
        const pipelineProps: CodePipelinePipelineProps = {
            source: pipelineSource,
            repositories: repositories,
            synth: synthStep
        };
        const pipeline = this.createPipeline(pipelineProps);
        const ecrSteps = this.createEcrSteps({
            repositories: repositories,
            source: pipelineSource
        });
        this.createEcrWave(pipeline, ecrSteps);
        this.createEnvironmentStages({
            pipeline: pipeline,
            repositories: repositories,
            environments: this.config.Environments
        });
        this.createPipelineNotifications(pipeline);
        new CodePipelineStackPermissions(this, this.getName(), {
            configParam: configParam,
            synth: synthStep,
            repositories: repositories,
            ecrSteps: ecrSteps,
            environments: this.config.Environments
        })
    }

    getName(suffix?: string): string {
        return this.getNameFromConfig(this.config, suffix);
    }

    private createEcrWave(pipeline: CodePipelinePipeline, ecrSteps: CodePipelineEcrSteps): Wave {
        return pipeline.pipeline.addWave('ecr-build', {
            post: ecrSteps.steps
        });
    }

    private createEcrSteps(props: CodePipelineEcrStepsProps): CodePipelineEcrSteps {
        return new CodePipelineEcrSteps(this, this.getName(), props);
    }

    private createEnvironmentStages(props: CodePipelineEnvStageProps): CodePipelineEnvStages {
        return new CodePipelineEnvStages(this, 'env-stages', props);
    }

    private createPipeline(props: CodePipelinePipelineProps): CodePipelinePipeline {
        return new CodePipelinePipeline(this, this.getName(), props);
    }

    private createPipelineNotifications(pipeline: CodePipelinePipeline): void {
        if (this.config.Parameters.pipelineNotification) {
            let props = this.config.Parameters.pipelineNotification;
            const notificationTargets = new NotificationTargets(this, this.getName(), {
                detailType: props.detailType,
                events: props.events,
                emails: props.emails
            });
            for (const target of notificationTargets.targets) {
                pipeline.pipeline.pipeline.notifyOn(this.getName(), target, {
                    detailType: props.detailType,
                    events: props.events
                });
            }
        }
    }

    private createCodeStarSource(props: CodeStarSourceProps): CodePipelineCodeStarSource {
        return new CodePipelineCodeStarSource(this, this.getName(), props);
    }

    private createRepositories(): Repositories {
        return new Repositories(this, this.getName(), this.config.Parameters.repositories);
    }

    private getNameFromConfig(config: T, suffix?: string): string {
        if (!this.cachedName) {
            this.cachedName = `${config.College.toLowerCase()}-${config.Name.toLowerCase()}`;
        }
        if (suffix) {
            return `${this.cachedName}-${suffix}`;
        }
        return this.cachedName;
    }

    private createSynthStep(pipelineSource: CodePipelineCodeStarSource) {
        return new CodePipelineSynthStep(this, this.getName(), {
            source: pipelineSource.source
        });
    }
}