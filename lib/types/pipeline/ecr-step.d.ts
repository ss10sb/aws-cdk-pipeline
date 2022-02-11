import { NonConstruct } from "@smorken/cdk-utils";
import { IRepository } from "@aws-cdk/aws-ecr";
import { PipelinesCodeStarSource } from "./code-star-source";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep } from "@aws-cdk/pipelines";
import { IRole } from "@aws-cdk/aws-iam";
export interface EcrStepProps {
    readonly name: string;
    readonly repository: IRepository;
    readonly imageTag: string;
    readonly source: PipelinesCodeStarSource;
    readonly role: IRole;
}
export declare class EcrStep extends NonConstruct {
    readonly props: EcrStepProps;
    readonly step: CodeBuildStep;
    constructor(scope: Construct, id: string, props: EcrStepProps);
    protected createStep(): CodeBuildStep;
    protected getCommands(): string[];
}
