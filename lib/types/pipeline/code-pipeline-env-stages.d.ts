import { NonConstruct } from "@smorken/cdk-utils";
import { CodePipelinePipeline } from "./code-pipeline-pipeline";
import { Repositories } from "../factories/repositories";
import { EnvConfig, EnvProps } from "../definitions/env-config";
import { Construct } from "@aws-cdk/core";
import { EnvStage } from "../env-stage";
import { IStage } from "@aws-cdk/aws-codepipeline";
export interface CodePipelineEnvStageProps {
    pipeline: CodePipelinePipeline;
    repositories: Repositories;
    environments: EnvConfig[];
}
export declare class CodePipelineEnvStages extends NonConstruct {
    readonly props: CodePipelineEnvStageProps;
    readonly stages: IStage[];
    constructor(scope: Construct, id: string, props: CodePipelineEnvStageProps);
    protected getStageName(envConfig: EnvConfig): string;
    createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage;
    protected createEnvironmentStages(): IStage[];
    protected actionsFromEnvironment(stage: IStage, envConfig: EnvConfig): void;
}
