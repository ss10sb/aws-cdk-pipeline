import { StackConfig } from "../definitions/stack-config";
import { ConfigStack } from "@smorken/cdk-utils";
export declare class Clientable<T extends StackConfig> {
    stack: ConfigStack<T>;
    constructor(stack: ConfigStack<T>);
}
