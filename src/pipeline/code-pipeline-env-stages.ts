import {NonConstruct} from "@smorken/cdk-utils";
import {CodePipelinePipeline} from "./code-pipeline-pipeline";
import {Repositories} from "../factories/repositories";
import {EnvConfig, EnvProps} from "../definitions/env-config";
import {Construct} from "@aws-cdk/core";
import {EnvStage} from "../env-stage";
import {StageDeployment} from "@aws-cdk/pipelines";
import {CodePipelineStageSteps} from "./code-pipeline-stage-steps";

export interface CodePipelineEnvStageProps {
    pipeline: CodePipelinePipeline;
    repositories: Repositories;
    environments: EnvConfig[];
}

export class CodePipelineEnvStages extends NonConstruct {
    readonly props: CodePipelineEnvStageProps;
    readonly stages: StageDeployment[];

    constructor(scope: Construct, id: string, props: CodePipelineEnvStageProps) {
        super(scope, id);
        this.props = props;
        this.stages = this.createEnvironmentStages();
    }

    protected getStageName(envConfig: EnvConfig): string {
        let parts: string[] = [envConfig.Environment];
        if (envConfig.NameSuffix) {
            parts.push(envConfig.NameSuffix);
        }
        parts.push('stage');
        return parts.join('-');
    }

    public createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage {
        const name = this.getStageName(envConfig);
        const env = {
            account: envConfig.AWSAccountId ?? process.env.CDK_DEFAULT_ACCOUNT,
            region: envConfig.AWSRegion ?? process.env.CDK_DEFAULT_REGION
        }
        const stage = new EnvStage(this.scope, name, {
            env: env
        });
        stage.exec(envConfig, envProps);
        return stage;
    }

    protected createEnvironmentStages(): StageDeployment[] {
        let stages: StageDeployment[] = [];
        for (const envConfig of this.props.environments) {
            const deploy: boolean = envConfig.Parameters.deploy ?? true;
            if (deploy) {
                const envStage = this.createEnvStageFromEnvironment(envConfig, {
                    repositories: this.props.repositories
                });
                const stage = this.props.pipeline.pipeline.addStage(envStage);
                this.stepsFromEnvironment(stage, envConfig);
                stages.push(stage);
            }
        }
        return stages;
    }

    protected stepsFromEnvironment(stage: StageDeployment, envConfig: EnvConfig): void {
        const stageSteps = new CodePipelineStageSteps(stage);
        stageSteps.fromEnvConfig(envConfig);
    }
}