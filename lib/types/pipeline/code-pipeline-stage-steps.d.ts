import { Newable } from "@smorken/cdk-utils";
import { StageDeployment, Step } from "@aws-cdk/pipelines";
import { EnvConfig } from "../definitions/env-config";
interface Actionable {
    stepClass: Newable<Step>;
    stepProps?: {
        [key: string]: string | number | boolean;
    };
}
export declare class CodePipelineStageSteps {
    readonly stageDeployment: StageDeployment;
    readonly map: {
        [key: string]: Actionable;
    };
    constructor(stageDeployment: StageDeployment);
    fromEnvConfig(envConfig: EnvConfig): void;
    addSteps(steps: {
        [key: string]: any;
    }): void;
    getSteps(steps: {
        [key: string]: any;
    }): Step[];
    getStep(name: string, props: {
        [key: string]: any;
    }): Step | null;
    getStepProps(name: string, defaultProps: {
        [key: string]: any;
    }, props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export {};
