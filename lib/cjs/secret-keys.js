"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretKeys = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
class SecretKeys {
    constructor(configDir) {
        this.configDir = configDir;
    }
    addSecretKeys(config) {
        var _a;
        for (const environment of (_a = config.Environments) !== null && _a !== void 0 ? _a : []) {
            environment.Parameters.secretKeys = this.getSecretKeys(environment);
        }
        return config;
    }
    getSecretKeys(config) {
        const secretsConfig = this.getSecretsConfig(config.Environment);
        return this.convertSecretsToKeys(secretsConfig);
    }
    getSecretsConfig(env) {
        return cdk_utils_1.Utils.getConfig(this.configDir, 'secrets', env);
    }
    convertSecretsToKeys(secretsConfig) {
        let keys = [];
        for (const secret of secretsConfig.Parameters.secrets) {
            keys.push(secret.key);
        }
        return keys;
    }
}
exports.SecretKeys = SecretKeys;
//# sourceMappingURL=secret-keys.js.map