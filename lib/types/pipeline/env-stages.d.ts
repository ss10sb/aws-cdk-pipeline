import { NonConstruct } from "@smorken/cdk-utils";
import { PipelinesPipeline } from "./pipeline";
import { Repositories } from "../factories/repositories";
import { EnvConfig, EnvProps } from "../definitions/env-config";
import { Construct } from "@aws-cdk/core";
import { EnvStage } from "../env-stage";
import { IStage } from "@aws-cdk/aws-codepipeline";
export interface PipelinesEnvStageProps {
    pipeline: PipelinesPipeline;
    repositories: Repositories;
    environments: EnvConfig[];
}
export declare class PipelinesEnvStages extends NonConstruct {
    readonly props: PipelinesEnvStageProps;
    readonly stages: IStage[];
    constructor(scope: Construct, id: string, props: PipelinesEnvStageProps);
    protected getStageName(envConfig: EnvConfig): string;
    createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage;
    protected createEnvironmentStages(): IStage[];
    protected actionsFromEnvironment(stage: IStage, envConfig: EnvConfig): void;
}
