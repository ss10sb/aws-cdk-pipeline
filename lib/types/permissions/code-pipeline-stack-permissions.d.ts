import { NonConstruct } from "@smorken/cdk-utils";
import { IStringParameter } from "@aws-cdk/aws-ssm";
import { SynthStep } from "../pipeline/synth-step";
import { Repositories } from "../factories/repositories";
import { EnvConfig } from "../definitions/env-config";
import { Construct } from "@aws-cdk/core";
import { IPrincipal } from "@aws-cdk/aws-iam";
import { EcrSteps } from "../pipeline/ecr-steps";
export interface CodePipelineStackPermissionsProps {
    configParam: IStringParameter;
    synth: SynthStep;
    repositories: Repositories;
    ecrSteps: EcrSteps;
    environments: EnvConfig[];
}
export declare class CodePipelineStackPermissions extends NonConstruct {
    readonly props: CodePipelineStackPermissionsProps;
    constructor(scope: Construct, id: string, props: CodePipelineStackPermissionsProps);
    protected handlePermissions(): void;
    protected ecrSteps(): void;
    protected environments(): void;
    protected accountsCanDescribeEcr(): void;
    protected accountsCanPullFromEcr(): void;
    protected synth(): void;
    protected addCdkRoleToPrincipal(grantee: IPrincipal, role?: string): void;
}
