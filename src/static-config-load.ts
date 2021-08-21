import {SecretKeys} from "./secret-keys";
import {Utils} from "@smorken/cdk-utils";
import {StackConfig} from "./definitions/stack-config";

export class StaticConfigLoad<T extends StackConfig> {
    readonly configDir: string;
    readonly secretKeys: SecretKeys;

    constructor(configDir: string) {
        this.configDir = configDir;
        this.secretKeys = new SecretKeys(configDir);
    }

    fetch(addSecretKeys: boolean = true): T {
        const config = Utils.getConfig<T>(this.configDir);
        if (addSecretKeys) {
            this.secretKeys.addSecretKeys(config);
        }
        return config;
    }
}
