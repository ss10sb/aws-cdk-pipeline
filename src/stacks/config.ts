import {ConfigStack} from "@smorken/cdk-utils";
import {StackConfig} from "../definitions/stack-config";

export class ConfigParamStack<T extends StackConfig> extends ConfigStack<T> {

    exec() {
        this.storeConfig(this.config);
    }
}
