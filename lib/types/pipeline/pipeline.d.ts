import { NonConstruct } from "@smorken/cdk-utils";
import { CodeStarSource } from "./code-star-source";
import { SynthStep } from "./synth-step";
import { Repositories } from "../factories/repositories";
import { Construct } from "@aws-cdk/core";
import { CodePipeline } from "@aws-cdk/pipelines";
import { IRepository } from "@aws-cdk/aws-ecr";
export interface PipelineProps {
    source: CodeStarSource;
    synth: SynthStep;
    repositories: Repositories;
}
export declare class Pipeline extends NonConstruct {
    readonly props: PipelineProps;
    readonly pipeline: CodePipeline;
    constructor(scope: Construct, id: string, props: PipelineProps);
    protected createCodePipeline(): CodePipeline;
    protected getRepositoryArray(): IRepository[];
}
