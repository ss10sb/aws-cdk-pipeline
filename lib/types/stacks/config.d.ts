import { ConfigStack } from "@smorken/cdk-utils";
import { StackConfig } from "../definitions/stack-config";
export declare class ConfigParamStack<T extends StackConfig> extends ConfigStack<T> {
    exec(): void;
}
