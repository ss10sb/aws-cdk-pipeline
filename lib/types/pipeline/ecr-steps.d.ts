import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep } from "@aws-cdk/pipelines";
import { IRole } from "@aws-cdk/aws-iam";
import { Repositories } from "../factories/repositories";
import { PipelinesCodeStarSource } from "./code-star-source";
export interface EcrStepsProps {
    repositories: Repositories;
    source: PipelinesCodeStarSource;
}
export declare class EcrSteps extends NonConstruct {
    readonly props: EcrStepsProps;
    readonly steps: CodeBuildStep[];
    readonly role: IRole;
    constructor(scope: Construct, id: string, props: EcrStepsProps);
    private createEcrSteps;
}
