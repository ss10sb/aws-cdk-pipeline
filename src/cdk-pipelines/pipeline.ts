import {Construct} from "@aws-cdk/core";
import {CdkPipeline, DockerCredential, SimpleSynthAction} from "@aws-cdk/pipelines";
import {Source} from "./source-actions";
import {Artifact, IAction, IStage} from "@aws-cdk/aws-codepipeline";
import {NonConstruct} from "@smorken/cdk-utils";
import {Repositories} from "../factories/repositories";
import {EcrCodeBuild} from "./ecr-code-build";

export interface PipelineProps {
    readonly source: Source;
    readonly synthSubdir?: string;
    readonly repositories: Repositories;
}

export class Pipeline extends NonConstruct {
    readonly props: PipelineProps;
    readonly pipeline: CdkPipeline;
    readonly cloudAssemblyArtifact: Artifact;
    readonly synth: SimpleSynthAction;

    constructor(scope: Construct, id: string, props: PipelineProps) {
        super(scope, id);
        this.props = props;
        this.cloudAssemblyArtifact = new Artifact();
        this.synth = this.createSynthAction();
        this.pipeline = this.createPipeline();
    }

    public fromEcrCodeBuild(ecrCodeBuild: EcrCodeBuild, stageName: string = 'EcrBuild'): IStage {
        return this.addStageAndActions(stageName, ecrCodeBuild.actions);
    }

    public addStageAndActions(stageName: string, actions: IAction[]): IStage {
        const stage = this.createStage(stageName);
        for (const action of actions) {
            stage.addAction(action);
        }
        return stage;
    }

    public createStage(name: string): IStage {
        return this.pipeline.codePipeline.addStage({stageName: name});
    }

    private createSynthAction(): SimpleSynthAction {
        const name = this.mixNameWithId('synth-build');
        let options = {
            projectName: name,
            actionName: name,
            sourceArtifact: this.props.source.sourceArtifact,
            cloudAssemblyArtifact: this.cloudAssemblyArtifact,
            subdirectory: this.props.synthSubdir,
            buildCommand: this.getBuildCommand()
        };
        return SimpleSynthAction.standardNpmSynth(options);
    }

    private createPipeline(): CdkPipeline {
        const name = this.mixNameWithId('pipeline');
        return new CdkPipeline(this.scope, name, {
            pipelineName: name,
            cloudAssemblyArtifact: this.cloudAssemblyArtifact,
            sourceAction: this.props.source.sourceAction,
            synthAction: this.synth,
            dockerCredentials: [this.getDockerCredentialsFromRepositories()]
        });
    }

    private getDockerCredentialsFromRepositories(): DockerCredential {
        return DockerCredential.ecr(this.props.repositories.repoArray());
    }

    private getBuildCommand(): string {
        const files: string[] = ['_common.js', 'defaults.js'];
        let parts: string[] = [];
        for (const file of files) {
            parts.push(`cp config/${file}.copy config/${file}`);
        }
        return parts.join(' && ');
    }

    // private addConfigParamPermissionsToSynth(synth: SimpleSynthAction, configParam?: IStringParameter): void {
    //     if (configParam) {
    //         configParam.grantRead(synth.grantPrincipal);
    //     }
    // }
    //
    // private addCdkPermissionsForEnvironments(pipeline: CdkPipeline, synth: SimpleSynthAction, environments?: EnvConfig[]): void {
    //     let resources: string[] = [
    //         this.getResourceByRoleForAccountAndRegion(CdkRoles.LOOKUP, Stack.of(this).account, Stack.of(this).region)
    //     ];
    //     if (environments) {
    //         for (const environment of environments) {
    //             resources.push(this.getResourceFromEnvironment(environment, CdkRoles.LOOKUP));
    //         }
    //     }
    //     const statement = this.getPolicyStatementForResources(resources);
    //     pipeline.codePipeline.addToRolePolicy(statement);
    //     synth.grantPrincipal.addToPrincipalPolicy(statement);
    // }
    //
    // private getPolicyStatementForResources(resources: string[]): PolicyStatement {
    //     return new PolicyStatement({
    //         effect: Effect.ALLOW,
    //         actions: ['sts:AssumeRole'],
    //         resources: resources
    //     });
    // }
    //
    // private getResourceFromEnvironment(environment: EnvConfig, roleName: string): string {
    //     return this.getResourceByRoleForAccountAndRegion(roleName, environment.AWSAccountId, environment.AWSRegion);
    // }
    //
    // private getResourceByRoleForAccountAndRegion(roleName: string, accountId?: string, region?: string): string {
    //     return Arn.format({
    //         service: 'iam',
    //         resource: 'role',
    //         account: accountId,
    //         resourceName: `${roleName}-${accountId}-${region}`,
    //         region: ''
    //     }, Stack.of(this));
    // }
}
