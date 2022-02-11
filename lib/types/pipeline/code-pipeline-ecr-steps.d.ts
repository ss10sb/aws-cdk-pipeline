import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep } from "@aws-cdk/pipelines";
import { IRole } from "@aws-cdk/aws-iam";
import { Repositories } from "../factories/repositories";
import { CodePipelineCodeStarSource } from "./code-pipeline-code-star-source";
export interface CodePipelineEcrStepsProps {
    repositories: Repositories;
    source: CodePipelineCodeStarSource;
}
export declare class CodePipelineEcrSteps extends NonConstruct {
    readonly props: CodePipelineEcrStepsProps;
    readonly steps: CodeBuildStep[];
    readonly role: IRole;
    constructor(scope: Construct, id: string, props: CodePipelineEcrStepsProps);
    private createEcrSteps;
}
