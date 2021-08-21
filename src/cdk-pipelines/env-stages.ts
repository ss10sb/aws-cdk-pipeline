import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {Pipeline} from "./pipeline";
import {EnvConfig, EnvProps} from "../definitions/env-config";
import {CdkStage} from "@aws-cdk/pipelines";
import {Repositories} from "../factories/repositories";
import {EnvStage} from "../env-stage";
import {StageActions} from "./stage-actions";

export interface EnvStagesProps {
    pipeline: Pipeline;
    repositories: Repositories;
    environments: EnvConfig[];
}

export class EnvStages extends NonConstruct {
    readonly props: EnvStagesProps;
    readonly stages: CdkStage[];

    constructor(scope: Construct, id: string, props: EnvStagesProps) {
        super(scope, id);
        this.props = props;
        this.stages = this.createEnvironmentStages();
    }

    public createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage {
        const name = `${envConfig.Environment}-stage`;
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

    protected createEnvironmentStages(): CdkStage[] {
        let stages: CdkStage[] = [];
        for (const envConfig of this.props.environments) {
            const deploy: boolean = envConfig.Parameters.deploy ?? true;
            if (deploy) {
                const envStage = this.createEnvStageFromEnvironment(envConfig, {
                    repositories: this.props.repositories
                });
                const cdkStage = this.props.pipeline.pipeline.addApplicationStage(envStage);
                this.actionsFromEnvironment(cdkStage, envConfig);
            }
        }
        return stages;
    }

    protected actionsFromEnvironment(cdkStage: CdkStage, envConfig: EnvConfig): void {
        const stageActions = new StageActions(cdkStage);
        stageActions.fromEnvConfig(envConfig);
    }
}
