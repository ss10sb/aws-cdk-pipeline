import {NonConstruct} from "@smorken/cdk-utils";
import {CodePipelineCodeStarSource} from "./code-pipeline-code-star-source";
import {CodePipelineSynthStep} from "./code-pipeline-synth-step";
import {Repositories} from "../factories/repositories";
import {Construct} from "@aws-cdk/core";
import {CodePipeline, DockerCredential} from "@aws-cdk/pipelines";
import {IRepository} from "@aws-cdk/aws-ecr";
import {LinuxBuildImage} from "@aws-cdk/aws-codebuild";

export interface CodePipelinePipelineProps {
    source: CodePipelineCodeStarSource;
    synth: CodePipelineSynthStep;
    repositories: Repositories;
}

export class CodePipelinePipeline extends NonConstruct {
    readonly props: CodePipelinePipelineProps;
    readonly pipeline: CodePipeline;

    constructor(scope: Construct, id: string, props: CodePipelinePipelineProps) {
        super(scope, id);
        this.props = props;
        this.pipeline = this.createCodePipeline();
    }

    protected createCodePipeline(): CodePipeline {
        const name = this.mixNameWithId('code-pipeline');
        return new CodePipeline(this.scope, name, {
            pipelineName: name,
            synth: this.props.synth.synth,
            dockerCredentials: [DockerCredential.ecr(this.getRepositoryArray())],
            crossAccountKeys: true,
            assetPublishingCodeBuildDefaults: {
                buildEnvironment: {
                    buildImage: LinuxBuildImage.STANDARD_5_0,
                    privileged: true,
                    environmentVariables: {}
                }
            }
        });
    }

    protected getRepositoryArray(): IRepository[] {
        let repos: IRepository[] = [];
        for (const [key, repo] of this.props.repositories.repoEntries()) {
            repos.push(repo);
        }
        return repos;
    }
}
