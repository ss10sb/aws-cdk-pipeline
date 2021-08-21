import { Construct, Stage, StageProps } from "@aws-cdk/core";
import { EnvConfig, EnvProps } from "./definitions/env-config";
export declare class EnvStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps);
    exec(config: EnvConfig, envProps: EnvProps): void;
}
