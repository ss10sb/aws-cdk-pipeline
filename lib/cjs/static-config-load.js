"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticConfigLoad = void 0;
const secret_keys_1 = require("./secret-keys");
const cdk_utils_1 = require("@smorken/cdk-utils");
class StaticConfigLoad {
    constructor(configDir) {
        this.configDir = configDir;
        this.secretKeys = new secret_keys_1.SecretKeys(configDir);
    }
    fetch(addSecretKeys = true) {
        const config = cdk_utils_1.Utils.getConfig(this.configDir);
        if (addSecretKeys) {
            this.secretKeys.addSecretKeys(config);
        }
        return config;
    }
}
exports.StaticConfigLoad = StaticConfigLoad;
//# sourceMappingURL=static-config-load.js.map