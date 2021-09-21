"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigParam = void 0;
const tslib_1 = require("tslib");
const client_ssm_1 = require("@aws-sdk/client-ssm");
const cdk_utils_1 = require("@smorken/cdk-utils");
const path = (0, tslib_1.__importStar)(require("path"));
const fs = (0, tslib_1.__importStar)(require("fs"));
const clientable_1 = require("./clientable");
class ConfigParam extends clientable_1.Clientable {
    constructor(stack, configDir) {
        super(stack);
        this.fileName = 'param-store.json';
        this.configDir = configDir;
        this.client = this.createClient(this.getClientConfig());
    }
    async fetch(key) {
        var _a, _b;
        const cached = this.fromParamStoreFile();
        if (cached) {
            return cached;
        }
        const command = new client_ssm_1.GetParameterCommand({ Name: key });
        const response = await this.client.send(command);
        const parameter = (_a = response.Parameter) !== null && _a !== void 0 ? _a : {};
        const config = cdk_utils_1.ConfigLoader.convertStringToConfig((_b = parameter.Value) !== null && _b !== void 0 ? _b : '');
        this.toParamStoreFile(config);
        return config;
    }
    remove() {
        const file = this.getParamStoreFileName();
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }
    fromParamStoreFile() {
        const file = this.getParamStoreFileName();
        if (fs.existsSync(file)) {
            return cdk_utils_1.ConfigLoader.convertStringToConfig(fs.readFileSync(file, 'utf8'));
        }
    }
    toParamStoreFile(config) {
        try {
            const file = this.getParamStoreFileName();
            fs.writeFileSync(file, JSON.stringify(config));
        }
        catch (e) {
            console.log(e);
        }
    }
    getParamStoreFileName() {
        return path.resolve(this.configDir, this.fileName);
    }
    createClient(config = {}) {
        return new client_ssm_1.SSMClient(config);
    }
    getClientConfig() {
        return {
            region: this.stack.region
        };
    }
}
exports.ConfigParam = ConfigParam;
//# sourceMappingURL=config-param.js.map