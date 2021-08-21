import { NonConstruct } from "@smorken/cdk-utils";
import { IRepository } from "@aws-cdk/aws-ecr";
import { CodeStarSource } from "./code-star-source";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep } from "@aws-cdk/pipelines";
import { IRole } from "@aws-cdk/aws-iam";
export interface EcrStepProps {
    readonly name: string;
    readonly repository: IRepository;
    readonly imageTag: string;
    readonly source: CodeStarSource;
}
export declare class EcrStep extends NonConstruct {
    readonly props: EcrStepProps;
    readonly step: CodeBuildStep;
    readonly role: IRole;
    constructor(scope: Construct, id: string, props: EcrStepProps);
    protected createStep(): CodeBuildStep;
    protected getCommands(): string[];
}
