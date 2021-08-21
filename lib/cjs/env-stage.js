"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvStage = void 0;
const core_1 = require("@aws-cdk/core");
const cdk_utils_1 = require("@smorken/cdk-utils");
const env_stack_1 = require("./env-stack");
class EnvStage extends core_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
    }
    exec(config, envProps) {
        const name = cdk_utils_1.Utils.getMainStackName(config);
        const stack = new env_stack_1.EnvStack(this, name, {}, config, envProps);
        stack.exec();
    }
}
exports.EnvStage = EnvStage;
//# sourceMappingURL=env-stage.js.map