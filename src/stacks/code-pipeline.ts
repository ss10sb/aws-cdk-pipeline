import {StackConfig} from "../definitions/stack-config";
import {ConfigStack} from "@smorken/cdk-utils";
import {CodeStarSourceProps} from "../definitions/source";
import {PipelinesCodeStarSource} from "../pipeline/code-star-source";
import {Repositories} from "../factories/repositories";
import {NotificationRule} from "../pipeline/notification-rule";
import {PipelinesPipeline, PipelinesPipelineProps} from "../pipeline/pipeline";
import {PipelinesEnvStageProps, PipelinesEnvStages} from "../pipeline/env-stages";
import {SynthStep} from "../pipeline/synth-step";
import {CodePipelineStackPermissions} from "../permissions/code-pipeline-stack-permissions";
import {EcrSteps, EcrStepsProps} from "../pipeline/ecr-steps";
import {Wave} from "@aws-cdk/pipelines";

export class CodePipelineStack<T extends StackConfig> extends ConfigStack<T> {
    cachedName?: string;

    exec() {
        const configParam = this.configFetchStore.configParamStore.fetchStringAsPlaceholder(this.configFetchStore.paramName);
        const repositories = this.createRepositories();
        const pipelineSource = this.createCodeStarSource(<CodeStarSourceProps>this.config.Parameters.sourceProps);
        const synthStep = this.createSynthStep(pipelineSource);
        const pipelineProps: PipelinesPipelineProps = {
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
        this.createPipelineNotificationRule(pipeline);
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

    private createEcrWave(pipeline: PipelinesPipeline, ecrSteps: EcrSteps): Wave {
        return pipeline.pipeline.addWave('ecr-build', {
            post: ecrSteps.steps
        });
    }

    private createEcrSteps(props: EcrStepsProps): EcrSteps {
        return new EcrSteps(this, this.getName(), props);
    }

    private createEnvironmentStages(props: PipelinesEnvStageProps): PipelinesEnvStages {
        return new PipelinesEnvStages(this, 'env-stages', props);
    }

    private createPipeline(props: PipelinesPipelineProps): PipelinesPipeline {
        return new PipelinesPipeline(this, this.getName(), props);
    }

    private createPipelineNotificationRule(pipeline: PipelinesPipeline): NotificationRule | undefined {
        if (this.config.Parameters.pipelineNotification) {
            let props = this.config.Parameters.pipelineNotification;
            return new NotificationRule(this, this.getName(), {
                detailType: props.detailType,
                events: props.events,
                emails: props.emails,
                source: pipeline.pipeline.pipeline,
            });
        }
    }

    private createCodeStarSource(props: CodeStarSourceProps): PipelinesCodeStarSource {
        return new PipelinesCodeStarSource(this, this.getName(), props);
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

    private createSynthStep(pipelineSource: PipelinesCodeStarSource) {
        return new SynthStep(this, this.getName(), {
            source: pipelineSource.source
        });
    }
}