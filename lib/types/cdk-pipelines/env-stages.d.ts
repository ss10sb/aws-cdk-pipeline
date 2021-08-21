import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { Pipeline } from "./pipeline";
import { EnvConfig, EnvProps } from "../definitions/env-config";
import { CdkStage } from "@aws-cdk/pipelines";
import { Repositories } from "../factories/repositories";
import { EnvStage } from "../env-stage";
export interface EnvStagesProps {
    pipeline: Pipeline;
    repositories: Repositories;
    environments: EnvConfig[];
}
export declare class EnvStages extends NonConstruct {
    readonly props: EnvStagesProps;
    readonly stages: CdkStage[];
    constructor(scope: Construct, id: string, props: EnvStagesProps);
    createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage;
    protected createEnvironmentStages(): CdkStage[];
    protected actionsFromEnvironment(cdkStage: CdkStage, envConfig: EnvConfig): void;
}
