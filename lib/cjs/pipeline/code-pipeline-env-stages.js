"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineEnvStages = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const env_stage_1 = require("../env-stage");
const code_pipeline_stage_actions_1 = require("./code-pipeline-stage-actions");
class CodePipelineEnvStages extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.stages = this.createEnvironmentStages();
    }
    getStageName(envConfig) {
        let parts = [envConfig.Environment];
        if (envConfig.NameSuffix) {
            parts.push(envConfig.NameSuffix);
        }
        parts.push('stage');
        return parts.join('-');
    }
    createEnvStageFromEnvironment(envConfig, envProps) {
        var _a, _b;
        const name = this.getStageName(envConfig);
        const env = {
            account: (_a = envConfig.AWSAccountId) !== null && _a !== void 0 ? _a : process.env.CDK_DEFAULT_ACCOUNT,
            region: (_b = envConfig.AWSRegion) !== null && _b !== void 0 ? _b : process.env.CDK_DEFAULT_REGION
        };
        const stage = new env_stage_1.EnvStage(this.scope, name, {
            env: env
        });
        stage.exec(envConfig, envProps);
        return stage;
    }
    createEnvironmentStages() {
        var _a;
        let stages = [];
        for (const envConfig of this.props.environments) {
            const deploy = (_a = envConfig.Parameters.deploy) !== null && _a !== void 0 ? _a : true;
            if (deploy) {
                const envStage = this.createEnvStageFromEnvironment(envConfig, {
                    repositories: this.props.repositories
                });
                const stage = this.props.pipeline.pipeline.pipeline.addStage(envStage);
                this.actionsFromEnvironment(stage, envConfig);
                stages.push(stage);
            }
        }
        return stages;
    }
    actionsFromEnvironment(stage, envConfig) {
        const stageActions = new code_pipeline_stage_actions_1.CodePipelineStageActions(stage);
        stageActions.fromEnvConfig(envConfig);
    }
}
exports.CodePipelineEnvStages = CodePipelineEnvStages;
//# sourceMappingURL=code-pipeline-env-stages.js.map