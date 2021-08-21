import {StackConfig} from "../definitions/stack-config";
import {ConfigStack} from "@smorken/cdk-utils";

export class Clientable<T extends StackConfig> {
    stack: ConfigStack<T>;

    constructor(stack: ConfigStack<T>) {
        this.stack = stack;
    }
}
