import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { IStringParameter } from "@aws-cdk/aws-ssm";
import { CodePipelineSynthStep } from "../pipeline/code-pipeline-synth-step";
import { Repositories } from "../factories/repositories";
import { SimpleSynthAction } from "@aws-cdk/pipelines";
import { IPrincipal } from "@aws-cdk/aws-iam";
import { EcrCodeBuild } from "../cdk-pipelines/ecr-code-build";
import { EnvConfig } from "../definitions/env-config";
export interface PipelineStackPermissionsProps {
    configParam: IStringParameter;
    synth: CodePipelineSynthStep | SimpleSynthAction;
    repositories: Repositories;
    ecrCodeBuild: EcrCodeBuild;
    environments: EnvConfig[];
}
export declare class PipelineStackPermissions extends NonConstruct {
    readonly props: PipelineStackPermissionsProps;
    constructor(scope: Construct, id: string, props: PipelineStackPermissionsProps);
    protected handlePermissions(): void;
    protected ecrCodeBuild(): void;
    protected environments(): void;
    protected accountsCanDescribeEcr(): void;
    protected accountsCanPullFromEcr(): void;
    protected synth(): void;
    protected addCdkRoleToPrincipal(grantee: IPrincipal, role?: string): void;
    protected getSynthGrantee(): IPrincipal;
}
