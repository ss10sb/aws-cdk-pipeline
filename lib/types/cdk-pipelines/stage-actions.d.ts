import { Action, CommonAwsActionProps, IAction } from "@aws-cdk/aws-codepipeline";
import { Newable } from "@smorken/cdk-utils";
import { CdkStage } from "@aws-cdk/pipelines";
import { EnvConfig } from "../definitions/env-config";
interface Actionable {
    actionClass: Newable<Action>;
    actionProps?: {
        [key: string]: string | number | boolean;
    };
}
export declare class StageActions {
    readonly stage: CdkStage;
    readonly map: {
        [key: string]: Actionable;
    };
    constructor(stage: CdkStage);
    fromEnvConfig(envConfig: EnvConfig): void;
    addActions(actions: {
        [key: string]: any;
    }): void;
    getActions(actions: {
        [key: string]: any;
    }): IAction[];
    getAction(name: string, props: {
        [key: string]: any;
    }): Action | null;
    getActionProps(name: string, defaultProps: {
        [key: string]: any;
    }, props: {
        [key: string]: any;
    }): CommonAwsActionProps;
}
export {};
