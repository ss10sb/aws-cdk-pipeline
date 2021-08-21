import { Construct } from "@aws-cdk/core";
import { CodeBuildAction } from "@aws-cdk/aws-codepipeline-actions";
import { Source } from "./source-actions";
import { Role } from "@aws-cdk/aws-iam";
import { IRepository } from "@aws-cdk/aws-ecr";
import { Repositories } from "../factories/repositories";
import { NonConstruct } from "@smorken/cdk-utils";
export interface EcrCodeBuildProps {
    readonly source: Source;
    readonly repositories: Repositories;
}
export interface EcrCodeBuildActionProps {
    readonly source: Source;
    readonly repository: IRepository;
    readonly name: string;
    readonly imageTag: string;
}
export declare class EcrCodeBuild extends NonConstruct {
    readonly actions: CodeBuildAction[];
    readonly buildRole: Role;
    readonly props: EcrCodeBuildProps;
    constructor(scope: Construct, id: string, props: EcrCodeBuildProps);
    private createBuildRole;
    private createCodeBuildActions;
    private createCodeBuildAction;
    private getBuildSpec;
}
