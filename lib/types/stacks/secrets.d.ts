import { ConfigStack } from "@smorken/cdk-utils";
import { SecretsConfig } from "../definitions/secrets-config";
export declare class SecretsStack<T extends SecretsConfig> extends ConfigStack<T> {
    exec(): void;
    private createSecret;
}
