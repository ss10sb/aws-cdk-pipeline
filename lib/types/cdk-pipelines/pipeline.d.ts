import { Construct } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { Source } from "./source-actions";
import { Artifact, IAction, IStage } from "@aws-cdk/aws-codepipeline";
import { NonConstruct } from "@smorken/cdk-utils";
import { Repositories } from "../factories/repositories";
import { EcrCodeBuild } from "./ecr-code-build";
export interface PipelineProps {
    readonly source: Source;
    readonly synthSubdir?: string;
    readonly repositories: Repositories;
}
export declare class Pipeline extends NonConstruct {
    readonly props: PipelineProps;
    readonly pipeline: CdkPipeline;
    readonly cloudAssemblyArtifact: Artifact;
    readonly synth: SimpleSynthAction;
    constructor(scope: Construct, id: string, props: PipelineProps);
    fromEcrCodeBuild(ecrCodeBuild: EcrCodeBuild, stageName?: string): IStage;
    addStageAndActions(stageName: string, actions: IAction[]): IStage;
    createStage(name: string): IStage;
    private createSynthAction;
    private createPipeline;
    private getDockerCredentialsFromRepositories;
    private getBuildCommand;
}
