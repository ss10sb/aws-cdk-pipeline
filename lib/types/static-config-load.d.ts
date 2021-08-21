import { SecretKeys } from "./secret-keys";
import { StackConfig } from "./definitions/stack-config";
export declare class StaticConfigLoad<T extends StackConfig> {
    readonly configDir: string;
    readonly secretKeys: SecretKeys;
    constructor(configDir: string);
    fetch(addSecretKeys?: boolean): T;
}
