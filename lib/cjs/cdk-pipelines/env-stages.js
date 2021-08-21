"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvStages = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const env_stage_1 = require("../env-stage");
const stage_actions_1 = require("./stage-actions");
class EnvStages extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.stages = this.createEnvironmentStages();
    }
    createEnvStageFromEnvironment(envConfig, envProps) {
        var _a, _b;
        const name = `${envConfig.Environment}-stage`;
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
                const cdkStage = this.props.pipeline.pipeline.addApplicationStage(envStage);
                this.actionsFromEnvironment(cdkStage, envConfig);
            }
        }
        return stages;
    }
    actionsFromEnvironment(cdkStage, envConfig) {
        const stageActions = new stage_actions_1.StageActions(cdkStage);
        stageActions.fromEnvConfig(envConfig);
    }
}
exports.EnvStages = EnvStages;
//# sourceMappingURL=env-stages.js.map