import { ConfigStack } from "@smorken/cdk-utils";
import { StackConfig } from "../definitions/stack-config";
import { Clientable } from "./clientable";
import { ECRClient } from "@aws-sdk/client-ecr";
export declare class EcrTag<T extends StackConfig> extends Clientable<T> {
    client: ECRClient;
    static cached: {
        [key: string]: string;
    };
    constructor(stack: ConfigStack<T>);
    fetch(imageName: string): Promise<string>;
    private getNextTag;
    private createClient;
    private getClientConfig;
}
