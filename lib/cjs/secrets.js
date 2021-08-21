"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secrets = void 0;
const tslib_1 = require("tslib");
const aws_secretsmanager_1 = require("@aws-cdk/aws-secretsmanager");
const ecs = tslib_1.__importStar(require("@aws-cdk/aws-ecs"));
const cdk_utils_1 = require("@smorken/cdk-utils");
class Secrets extends cdk_utils_1.NonConstruct {
    fetch() {
        if (!this.secret) {
            this.secret = aws_secretsmanager_1.Secret.fromSecretNameV2(this.scope, `${this.id}-secret-lookup`, this.getSecretName());
        }
        return this.secret;
    }
    getEcsSecretsFromSecret(keys, secret) {
        let secrets = {};
        for (const key of keys) {
            secrets[key] = ecs.Secret.fromSecretsManager(secret, key);
        }
        return secrets;
    }
    getEcsSecrets(keys) {
        const secret = this.fetch();
        return this.getEcsSecretsFromSecret(keys, secret);
    }
    create(secrets) {
        return new aws_secretsmanager_1.Secret(this.scope, `${this.id}-secret`, {
            secretName: this.getSecretName(),
            generateSecretString: {
                secretStringTemplate: this.convertParametersToJson(secrets),
                generateStringKey: 'salt'
            }
        });
    }
    getSecretName(suffix = '/environment') {
        let name = this.id;
        if (!name.endsWith('-secrets')) {
            name += '-secrets';
        }
        return name + suffix;
    }
    convertParametersToJson(secrets) {
        let params = {};
        for (const secret of secrets) {
            params[secret.key] = secret.value;
        }
        return JSON.stringify(params);
    }
}
exports.Secrets = Secrets;
//# sourceMappingURL=secrets.js.map