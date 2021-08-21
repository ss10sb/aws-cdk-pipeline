"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigParamStack = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
class ConfigParamStack extends cdk_utils_1.ConfigStack {
    exec() {
        this.storeConfig(this.config);
    }
}
exports.ConfigParamStack = ConfigParamStack;
//# sourceMappingURL=config.js.map