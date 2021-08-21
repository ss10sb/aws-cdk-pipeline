import {Utils} from "@smorken/cdk-utils";
import {StackConfig} from "./definitions/stack-config";
import {EnvConfig} from "./definitions/env-config";
import {SecretsConfig} from "./definitions/secrets-config";

export class SecretKeys {
    readonly configDir: string;

    constructor(configDir: string) {
        this.configDir = configDir;
    }

    addSecretKeys<T extends StackConfig>(config: T): T {
        for (const environment of config.Environments ?? []) {
            environment.Parameters.secretKeys = this.getSecretKeys(environment);
        }
        return config;
    }

    private getSecretKeys(config: EnvConfig): string[] {
        const secretsConfig = this.getSecretsConfig(config.Environment);
        return this.convertSecretsToKeys(secretsConfig);
    }

    private getSecretsConfig(env: string): SecretsConfig {
        return Utils.getConfig<SecretsConfig>(this.configDir, 'secrets', env);
    }

    private convertSecretsToKeys(secretsConfig: SecretsConfig): string[] {
        let keys: string[] = [];
        for (const secret of secretsConfig.Parameters.secrets) {
            keys.push(secret.key);
        }
        return keys;
    }
}
