import { NonConstruct } from "@smorken/cdk-utils";
import { PipelinesCodeStarSource } from "./code-star-source";
import { SynthStep } from "./synth-step";
import { Repositories } from "../factories/repositories";
import { Construct } from "@aws-cdk/core";
import { CodePipeline } from "@aws-cdk/pipelines";
import { IRepository } from "@aws-cdk/aws-ecr";
export interface PipelinesPipelineProps {
    source: PipelinesCodeStarSource;
    synth: SynthStep;
    repositories: Repositories;
}
export declare class PipelinesPipeline extends NonConstruct {
    readonly props: PipelinesPipelineProps;
    readonly pipeline: CodePipeline;
    constructor(scope: Construct, id: string, props: PipelinesPipelineProps);
    protected createCodePipeline(): CodePipeline;
    protected getRepositoryArray(): IRepository[];
}
