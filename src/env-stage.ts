import {Construct, Stage, StageProps} from "@aws-cdk/core";
import {Utils} from "@smorken/cdk-utils";
import {EnvStack} from "./env-stack";
import {EnvConfig, EnvProps} from "./definitions/env-config";

export class EnvStage extends Stage {

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);
    }

    exec(config: EnvConfig, envProps: EnvProps): void {
        const name = Utils.getMainStackName(config);
        const stack = new EnvStack(this, name, {}, config, envProps);
        stack.exec();
    }
}
