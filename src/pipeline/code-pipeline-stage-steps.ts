import {Newable} from "@smorken/cdk-utils";
import {ManualApprovalStep, StageDeployment, Step} from "@aws-cdk/pipelines";
import {EnvConfig} from "../definitions/env-config";
import {deepMerge} from "aws-cdk/lib/util";

interface Actionable {
    stepClass: Newable<Step>,
    stepProps?: { [key: string]: string | number | boolean }
}

export class CodePipelineStageSteps {

    readonly stageDeployment: StageDeployment;
    readonly map: { [key: string]: Actionable };

    constructor(stageDeployment: StageDeployment) {
        this.stageDeployment = stageDeployment;
        this.map = {
            manualApproval: {
                stepClass: ManualApprovalStep,
                stepProps: {
                    runOrder: 1
                }
            }
        }
    }

    fromEnvConfig(envConfig: EnvConfig): void {
        this.addSteps(envConfig.Parameters.steps ?? {});
    }

    addSteps(steps: { [key: string]: any }): void {
        const stageSteps: Step[] = this.getSteps(steps);
        this.stageDeployment.addPre(...stageSteps);
    }

    getSteps(steps: { [key: string]: any }): Step[] {
        let stageSteps: Step[] = [];
        for (const [k, v] of Object.entries(steps)) {
            const step = this.getStep(k, v);
            if (step) {
                stageSteps.push(step);
            }
        }
        return stageSteps;
    }

    getStep(name: string, props: { [key: string]: any }): Step | null {
        const mappedObj = this.map[name];
        if (mappedObj) {
            props = this.getStepProps(name, mappedObj.stepProps ?? {}, props);
            return new mappedObj.stepClass(`${name}-step`, props);
        }
        return null;
    }

    getStepProps(name: string, defaultProps: { [key: string]: any }, props: { [key: string]: any }): { [key: string]: any } {
        const baseObj = {};
        return deepMerge({
            baseObj,
            defaultProps,
            props
        });
    }
}