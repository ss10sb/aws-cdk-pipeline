"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStack = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const repositories_1 = require("../factories/repositories");
const notification_rule_1 = require("../pipeline/notification-rule");
const pipeline_stack_permissions_1 = require("../permissions/pipeline-stack-permissions");
const source_actions_1 = require("../cdk-pipelines/source-actions");
const pipeline_1 = require("../cdk-pipelines/pipeline");
const ecr_code_build_1 = require("../cdk-pipelines/ecr-code-build");
const env_stages_1 = require("../cdk-pipelines/env-stages");
class PipelineStack extends cdk_utils_1.ConfigStack {
    exec() {
        const configParam = this.configFetchStore.configParamStore.fetchStringAsPlaceholder(this.configFetchStore.paramName);
        const repositories = this.createRepositories();
        const pipelineSource = this.createCodeStarSource(this.config.Parameters.sourceProps);
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
        new pipeline_stack_permissions_1.PipelineStackPermissions(this, this.getName(), {
            configParam: configParam,
            synth: pipeline.synth,
            repositories: repositories,
            ecrCodeBuild: ecrBuild,
            environments: this.config.Environments
        });
    }
    getName(suffix) {
        return this.getNameFromConfig(this.config, suffix);
    }
    createEcrBuildAction(props) {
        return new ecr_code_build_1.EcrCodeBuild(this, this.getName(), props);
    }
    createEnvironmentStages(props) {
        return new env_stages_1.EnvStages(this, 'env-stages', props);
    }
    createPipeline(props) {
        return new pipeline_1.Pipeline(this, this.getName(), props);
    }
    createPipelineNotificationRule(pipeline) {
        if (this.config.Parameters.pipelineNotification) {
            let props = this.config.Parameters.pipelineNotification;
            return new notification_rule_1.NotificationRule(this, this.getName(), {
                detailType: props.detailType,
                events: props.events,
                emails: props.emails,
                source: pipeline.pipeline.codePipeline,
            });
        }
    }
    createCodeStarSource(props) {
        return new source_actions_1.CodeStarSource(this, this.getName(), props);
    }
    createRepositories() {
        return new repositories_1.Repositories(this, this.getName(), this.config.Parameters.repositories);
    }
    getNameFromConfig(config, suffix) {
        if (!this.cachedName) {
            this.cachedName = `${config.College.toLowerCase()}-${config.Name.toLowerCase()}`;
        }
        if (suffix) {
            return `${this.cachedName}-${suffix}`;
        }
        return this.cachedName;
    }
}
exports.PipelineStack = PipelineStack;
//# sourceMappingURL=pipeline.js.map