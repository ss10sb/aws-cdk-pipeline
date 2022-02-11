import { NonConstruct } from "@smorken/cdk-utils";
import { CodePipelineCodeStarSource } from "./code-pipeline-code-star-source";
import { CodePipelineSynthStep } from "./code-pipeline-synth-step";
import { Repositories } from "../factories/repositories";
import { Construct } from "@aws-cdk/core";
import { CodePipeline } from "@aws-cdk/pipelines";
import { IRepository } from "@aws-cdk/aws-ecr";
export interface CodePipelinePipelineProps {
    source: CodePipelineCodeStarSource;
    synth: CodePipelineSynthStep;
    repositories: Repositories;
}
export declare class CodePipelinePipeline extends NonConstruct {
    readonly props: CodePipelinePipelineProps;
    readonly pipeline: CodePipeline;
    constructor(scope: Construct, id: string, props: CodePipelinePipelineProps);
    protected createCodePipeline(): CodePipeline;
    protected getRepositoryArray(): IRepository[];
}
