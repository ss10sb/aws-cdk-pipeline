import {NonConstruct} from "@smorken/cdk-utils";
import {IStringParameter} from "@aws-cdk/aws-ssm";
import {SynthStep} from "../pipeline/synth-step";
import {Repositories} from "../factories/repositories";
import {EnvConfig} from "../definitions/env-config";
import {Construct, Stack} from "@aws-cdk/core";
import {IPrincipal} from "@aws-cdk/aws-iam";
import {Permissions} from "../factories/permissions";
import {EcrSteps} from "../pipeline/ecr-steps";

export interface CodePipelineStackPermissionsProps {
    configParam: IStringParameter;
    synth: SynthStep;
    repositories: Repositories;
    ecrSteps: EcrSteps;
    environments: EnvConfig[];
}

export class CodePipelineStackPermissions extends NonConstruct {
    readonly props: CodePipelineStackPermissionsProps;

    constructor(scope: Construct, id: string, props: CodePipelineStackPermissionsProps) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }

    protected handlePermissions(): void {
        this.synth();
        this.environments();
        this.ecrSteps();
    }

    protected ecrSteps(): void {
        Permissions.granteeCanPushPullFromRepositories(this.props.ecrSteps.role, this.props.repositories);
    }

    protected environments(): void {
        this.accountsCanDescribeEcr();
        this.accountsCanPullFromEcr();
    }

    protected accountsCanDescribeEcr(): void {
        let accountIds: string[] = [
            Stack.of(this.scope).account
        ];
        Permissions.accountIdsCanDescribeEcr(accountIds, this.props.repositories);
    }

    protected accountsCanPullFromEcr(): void {
        let accountIds: string[] = [];
        for (const envConfig of this.props.environments) {
            if (envConfig.AWSAccountId) {
                accountIds.push(envConfig.AWSAccountId);
            }
        }
        if (accountIds && accountIds.length > 0) {
            Permissions.accountIdsCanPullFromEcr(accountIds, this.props.repositories);
        }
    }

    protected synth(): void {
        const grantee = this.props.synth.role;
        Permissions.granteeCanReadParam(grantee, this.props.configParam);
        Permissions.granteeCanDescribeRepositories(grantee, this.props.repositories);
        this.addCdkRoleToPrincipal(grantee, 'lookup');
    }

    protected addCdkRoleToPrincipal(grantee: IPrincipal, role: string = 'lookup'): void {
        grantee.addToPrincipalPolicy(Permissions.policyStatementForBootstrapRole(role));
    }
}