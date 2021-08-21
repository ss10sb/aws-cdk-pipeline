import { StackConfig } from "./definitions/stack-config";
export declare class SecretKeys {
    readonly configDir: string;
    constructor(configDir: string);
    addSecretKeys<T extends StackConfig>(config: T): T;
    private getSecretKeys;
    private getSecretsConfig;
    private convertSecretsToKeys;
}
