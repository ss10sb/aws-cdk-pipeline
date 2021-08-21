"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsStack = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const secrets_1 = require("../secrets");
class SecretsStack extends cdk_utils_1.ConfigStack {
    exec() {
        this.createSecret();
    }
    createSecret() {
        const s = new secrets_1.Secrets(this, this.node.id);
        return s.create(this.config.Parameters.secrets);
    }
}
exports.SecretsStack = SecretsStack;
//# sourceMappingURL=secrets.js.map