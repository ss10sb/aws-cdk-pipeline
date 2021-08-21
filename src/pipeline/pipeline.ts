import {NonConstruct} from "@smorken/cdk-utils";
import {PipelinesCodeStarSource} from "./code-star-source";
import {SynthStep} from "./synth-step";
import {Repositories} from "../factories/repositories";
import {Construct} from "@aws-cdk/core";
import {CodePipeline, DockerCredential} from "@aws-cdk/pipelines";
import {IRepository} from "@aws-cdk/aws-ecr";
import {LinuxBuildImage} from "@aws-cdk/aws-codebuild";

export interface PipelinesPipelineProps {
    source: PipelinesCodeStarSource;
    synth: SynthStep;
    repositories: Repositories;
}

export class PipelinesPipeline extends NonConstruct {
    readonly props: PipelinesPipelineProps;
    readonly pipeline: CodePipeline;

    constructor(scope: Construct, id: string, props: PipelinesPipelineProps) {
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
