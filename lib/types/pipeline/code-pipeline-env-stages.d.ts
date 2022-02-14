import { NonConstruct } from "@smorken/cdk-utils";
import { CodePipelinePipeline } from "./code-pipeline-pipeline";
import { Repositories } from "../factories/repositories";
import { EnvConfig, EnvProps } from "../definitions/env-config";
import { Construct } from "@aws-cdk/core";
import { EnvStage } from "../env-stage";
import { StageDeployment } from "@aws-cdk/pipelines";
export interface CodePipelineEnvStageProps {
    pipeline: CodePipelinePipeline;
    repositories: Repositories;
    environments: EnvConfig[];
}
export declare class CodePipelineEnvStages extends NonConstruct {
    readonly props: CodePipelineEnvStageProps;
    readonly stages: StageDeployment[];
    constructor(scope: Construct, id: string, props: CodePipelineEnvStageProps);
    protected getStageName(envConfig: EnvConfig): string;
    createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage;
    protected createEnvironmentStages(): StageDeployment[];
    protected stepsFromEnvironment(stage: StageDeployment, envConfig: EnvConfig): void;
}
