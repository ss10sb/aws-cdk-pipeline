import {Config, ConfigParameters} from "@smorken/cdk-utils";
import {EnvConfig} from "./env-config";
import {RepositoryFactoryProps} from "../factories/repositories";
import {CodeStarSourceProps} from "./source";
import {NotificationRuleConfig} from "../pipeline/notifications";

export interface StackConfig extends Config {
    readonly Parameters: StackParameters;
    readonly Environments: EnvConfig[];
}

export interface StackParameters extends ConfigParameters {
    readonly sourceProps: CodeStarSourceProps;
    readonly repositories: RepositoryFactoryProps;
    readonly pipelineNotification?: NotificationRuleConfig;
}
