import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { StartStopFunction, StartStopFunctionProps } from "./start-stop-function";
import { ICluster } from "@aws-cdk/aws-ecs";
import { StartStopEvent } from "./start-stop-event";
export interface StartStopProps {
    readonly start: string;
    readonly stop: string;
    startStopFunctionProps?: StartStopFunctionProps;
}
export declare class StartStop extends NonConstruct {
    readonly props: StartStopProps;
    readonly startStopFunc: StartStopFunction;
    event?: StartStopEvent;
    constructor(scope: Construct, id: string, props: StartStopProps);
    createRules(cluster: ICluster): StartStopEvent;
    protected createStartStopFunction(): StartStopFunction;
}
