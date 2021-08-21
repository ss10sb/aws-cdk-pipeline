import {ConfigStack} from "@smorken/cdk-utils";
import {StackConfig} from "../definitions/stack-config";
import {Repositories} from "../factories/repositories";
import {CodeStarSourceProps} from "../definitions/source";
import {NotificationRule} from "../pipeline/notification-rule";
import {PipelineStackPermissions} from "../permissions/pipeline-stack-permissions";
import {CodeStarSource} from "../cdk-pipelines/source-actions";
import {Pipeline, PipelineProps} from "../cdk-pipelines/pipeline";
import {EcrCodeBuild, EcrCodeBuildProps} from "../cdk-pipelines/ecr-code-build";
import {EnvStages, EnvStagesProps} from "../cdk-pipelines/env-stages";

export class PipelineStack<T extends StackConfig> extends ConfigStack<T> {
    cachedName?: string;

    exec() {
        const configParam = this.configFetchStore.configParamStore.fetchStringAsPlaceholder(this.configFetchStore.paramName);
        const repositories = this.createRepositories();
        const pipelineSource = this.createCodeStarSource(<CodeStarSourceProps>this.config.Parameters.sourceProps);
        const pipeline = this.createPipeline({
            source: pipelineSource,
            repositories: repositories
        });
        const ecrBuild = this.createEcrBuildAction({
            source: pipelineSource,
            repositories: repositories
        });
        const ecrStage = pipeline.fromEcrCodeBuild(ecrBuild);
        const envStages = this.createEnvironmentStages({
            pipeline: pipeline,
            repositories: repositories,
            environments: this.config.Environments
        });
        this.createPipelineNotificationRule(pipeline);
        new PipelineStackPermissions(this, this.getName(), {
            configParam: configParam,
            synth: pipeline.synth,
            repositories: repositories,
            ecrCodeBuild: ecrBuild,
            environments: this.config.Environments
        });
    }

    getName(suffix?: string): string {
        return this.getNameFromConfig(this.config, suffix);
    }

    private createEcrBuildAction(props: EcrCodeBuildProps): EcrCodeBuild {
        return new EcrCodeBuild(this, this.getName(), props);
    }

    private createEnvironmentStages(props: EnvStagesProps): EnvStages {
        return new EnvStages(this, 'env-stages', props);
    }

    private createPipeline(props: PipelineProps): Pipeline {
        return new Pipeline(this, this.getName(), props);
    }

    private createPipelineNotificationRule(pipeline: Pipeline): NotificationRule | undefined {
        if (this.config.Parameters.pipelineNotification) {
            let props = this.config.Parameters.pipelineNotification;
            return new NotificationRule(this, this.getName(), {
                detailType: props.detailType,
                events: props.events,
                emails: props.emails,
                source: pipeline.pipeline.codePipeline,
            });
        }
    }

    private createCodeStarSource(props: CodeStarSourceProps): CodeStarSource {
        return new CodeStarSource(this, this.getName(), props);
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
}
