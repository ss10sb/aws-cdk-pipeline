"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineStack = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const code_pipeline_code_star_source_1 = require("../pipeline/code-pipeline-code-star-source");
const repositories_1 = require("../factories/repositories");
const notification_rule_1 = require("../pipeline/notification-rule");
const code_pipeline_pipeline_1 = require("../pipeline/code-pipeline-pipeline");
const code_pipeline_env_stages_1 = require("../pipeline/code-pipeline-env-stages");
const code_pipeline_synth_step_1 = require("../pipeline/code-pipeline-synth-step");
const code_pipeline_stack_permissions_1 = require("../permissions/code-pipeline-stack-permissions");
const code_pipeline_ecr_steps_1 = require("../pipeline/code-pipeline-ecr-steps");
class CodePipelineStack extends cdk_utils_1.ConfigStack {
    exec() {
        const configParam = this.configFetchStore.configParamStore.fetchStringAsPlaceholder(this.configFetchStore.paramName);
        const repositories = this.createRepositories();
        const pipelineSource = this.createCodeStarSource(this.config.Parameters.sourceProps);
        const synthStep = this.createSynthStep(pipelineSource);
        const pipelineProps = {
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
        new code_pipeline_stack_permissions_1.CodePipelineStackPermissions(this, this.getName(), {
            configParam: configParam,
            synth: synthStep,
            repositories: repositories,
            ecrSteps: ecrSteps,
            environments: this.config.Environments
        });
    }
    getName(suffix) {
        return this.getNameFromConfig(this.config, suffix);
    }
    createEcrWave(pipeline, ecrSteps) {
        return pipeline.pipeline.addWave('ecr-build', {
            post: ecrSteps.steps
        });
    }
    createEcrSteps(props) {
        return new code_pipeline_ecr_steps_1.CodePipelineEcrSteps(this, this.getName(), props);
    }
    createEnvironmentStages(props) {
        return new code_pipeline_env_stages_1.CodePipelineEnvStages(this, 'env-stages', props);
    }
    createPipeline(props) {
        return new code_pipeline_pipeline_1.CodePipelinePipeline(this, this.getName(), props);
    }
    createPipelineNotificationRule(pipeline) {
        if (this.config.Parameters.pipelineNotification) {
            let props = this.config.Parameters.pipelineNotification;
            return new notification_rule_1.NotificationRule(this, this.getName(), {
                detailType: props.detailType,
                events: props.events,
                emails: props.emails,
                source: pipeline.pipeline.pipeline,
            });
        }
    }
    createCodeStarSource(props) {
        return new code_pipeline_code_star_source_1.CodePipelineCodeStarSource(this, this.getName(), props);
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
    createSynthStep(pipelineSource) {
        return new code_pipeline_synth_step_1.CodePipelineSynthStep(this, this.getName(), {
            source: pipelineSource.source
        });
    }
}
exports.CodePipelineStack = CodePipelineStack;
//# sourceMappingURL=code-pipeline.js.map