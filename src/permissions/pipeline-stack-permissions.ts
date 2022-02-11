import {NonConstruct} from "@smorken/cdk-utils";
import {Construct, Stack} from "@aws-cdk/core";
import {IStringParameter} from "@aws-cdk/aws-ssm";
import {CodePipelineSynthStep} from "../pipeline/code-pipeline-synth-step";
import {Permissions} from "../factories/permissions";
import {Repositories} from "../factories/repositories";
import {SimpleSynthAction} from "@aws-cdk/pipelines";
import {IPrincipal} from "@aws-cdk/aws-iam";
import {EcrCodeBuild} from "../cdk-pipelines/ecr-code-build";
import {EnvConfig} from "../definitions/env-config";

export interface PipelineStackPermissionsProps {
    configParam: IStringParameter;
    synth: CodePipelineSynthStep | SimpleSynthAction;
    repositories: Repositories;
    ecrCodeBuild: EcrCodeBuild;
    environments: EnvConfig[];
}

export class PipelineStackPermissions extends NonConstruct {
    readonly props: PipelineStackPermissionsProps;

    constructor(scope: Construct, id: string, props: PipelineStackPermissionsProps) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }

    protected handlePermissions(): void {
        this.synth();
        this.ecrCodeBuild();
        this.environments();
    }

    protected ecrCodeBuild(): void {
        Permissions.granteeCanPushPullFromRepositories(this.props.ecrCodeBuild.buildRole, this.props.repositories);
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
        const grantee = this.getSynthGrantee();
        Permissions.granteeCanReadParam(grantee, this.props.configParam);
        Permissions.granteeCanDescribeRepositories(grantee, this.props.repositories);
        this.addCdkRoleToPrincipal(grantee, 'lookup');
    }

    protected addCdkRoleToPrincipal(grantee: IPrincipal, role: string = 'lookup'): void {
        grantee.addToPrincipalPolicy(Permissions.policyStatementForBootstrapRole(role));
    }

    protected getSynthGrantee(): IPrincipal {
        if (this.props.synth instanceof CodePipelineSynthStep) {
            return this.props.synth.role.grantPrincipal;
        }
        return this.props.synth.grantPrincipal;
    }
}
