import {Newable} from "@smorken/cdk-utils";
import {Action, CommonAwsActionProps, IAction, IStage} from "@aws-cdk/aws-codepipeline";
import {ManualApprovalAction} from "@aws-cdk/aws-codepipeline-actions";
import {EnvConfig} from "../definitions/env-config";
import {deepMerge} from "aws-cdk/lib/util";

interface Actionable {
    actionClass: Newable<Action>,
    actionProps?: { [key: string]: string | number | boolean }
}

export class PipelinesStageActions {
    readonly stage: IStage;
    readonly map: { [key: string]: Actionable };

    constructor(stage: IStage) {
        this.stage = stage;
        this.map = {
            manualApproval: {
                actionClass: ManualApprovalAction,
                actionProps: {
                    runOrder: 1
                }
            }
        }
    }

    fromEnvConfig(envConfig: EnvConfig): void {
        return this.addActions(envConfig.Parameters.actions ?? {});
    }

    addActions(actions: { [key: string]: any }): void {
        const stageActions: IAction[] = this.getActions(actions);
        for (const action of stageActions) {
            this.stage.addAction(action);
        }
    }

    getActions(actions: { [key: string]: any }): IAction[] {
        let stageActions: IAction[] = [];
        for (const [k, v] of Object.entries(actions)) {
            const action = this.getAction(k, v);
            if (action) {
                stageActions.push(action);
            }
        }
        return stageActions;
    }

    getAction(name: string, props: { [key: string]: any }): Action | null {
        const mappedObj = this.map[name];
        if (mappedObj) {
            props = this.getActionProps(name, mappedObj.actionProps ?? {}, props);
            return new mappedObj.actionClass(props);
        }
        return null;
    }

    getActionProps(name: string, defaultProps: { [key: string]: any }, props: { [key: string]: any }): CommonAwsActionProps {

        return <CommonAwsActionProps>deepMerge({
            actionName: `${this.stage.stageName}-${name}`
        }, defaultProps, props);
    }
}