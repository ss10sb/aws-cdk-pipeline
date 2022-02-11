import { NonConstruct } from "@smorken/cdk-utils";
import { IRepository } from "@aws-cdk/aws-ecr";
import { CodePipelineCodeStarSource } from "./code-pipeline-code-star-source";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep } from "@aws-cdk/pipelines";
import { IRole } from "@aws-cdk/aws-iam";
export interface CodePipelineEcrStepProps {
    readonly name: string;
    readonly repository: IRepository;
    readonly imageTag: string;
    readonly source: CodePipelineCodeStarSource;
    readonly role: IRole;
}
export declare class CodePipelineEcrStep extends NonConstruct {
    readonly props: CodePipelineEcrStepProps;
    readonly step: CodeBuildStep;
    constructor(scope: Construct, id: string, props: CodePipelineEcrStepProps);
    protected createStep(): CodeBuildStep;
    protected getCommands(): string[];
}
