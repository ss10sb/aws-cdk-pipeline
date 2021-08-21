import { SSMClient } from "@aws-sdk/client-ssm";
import { ConfigStack } from "@smorken/cdk-utils";
import { StackConfig } from "../definitions/stack-config";
import { Clientable } from "./clientable";
export declare class ConfigParam<T extends StackConfig> extends Clientable<T> {
    configDir: string;
    client: SSMClient;
    fileName: string;
    constructor(stack: ConfigStack<T>, configDir: string);
    fetch(key: string): Promise<T>;
    remove(): void;
    private fromParamStoreFile;
    private toParamStoreFile;
    private getParamStoreFileName;
    private createClient;
    private getClientConfig;
}
