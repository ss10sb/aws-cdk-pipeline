import { Newable } from "@smorken/cdk-utils";
import { Action, CommonAwsActionProps, IAction, IStage } from "@aws-cdk/aws-codepipeline";
import { EnvConfig } from "../definitions/env-config";
interface Actionable {
    actionClass: Newable<Action>;
    actionProps?: {
        [key: string]: string | number | boolean;
    };
}
export declare class CodePipelineStageActions {
    readonly stage: IStage;
    readonly map: {
        [key: string]: Actionable;
    };
    constructor(stage: IStage);
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
