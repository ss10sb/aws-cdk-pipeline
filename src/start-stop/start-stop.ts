import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {StartStopFunction, StartStopFunctionProps} from "./start-stop-function";
import {ICluster} from "@aws-cdk/aws-ecs";
import {LambdaEventStatus, StartStopEvent} from "./start-stop-event";

export interface StartStopProps {
    readonly start?: string;
    readonly stop: string;
    startStopFunctionProps?: StartStopFunctionProps;
}

export class StartStop extends NonConstruct {
    readonly props: StartStopProps;
    readonly startStopFunc: StartStopFunction;
    event?: StartStopEvent;

    constructor(scope: Construct, id: string, props: StartStopProps) {
        super(scope, id);
        this.props = props;
        this.startStopFunc = this.createStartStopFunction();
    }

    createRules(cluster: ICluster): StartStopEvent {
        this.event = new StartStopEvent(this.scope, this.id, {
            lambdaFunction: this.startStopFunc.function
        });
        if (this.props.start) {
            this.event.create({
                clusterArn: cluster.clusterArn,
                status: LambdaEventStatus.START,
                schedule: this.props.start
            });
        }
        this.event.create({
            clusterArn: cluster.clusterArn,
            status: LambdaEventStatus.STOP,
            schedule: this.props.stop
        });
        return this.event;
    }

    protected createStartStopFunction(): StartStopFunction {
        return new StartStopFunction(this.scope, this.id, this.props.startStopFunctionProps ?? {});
    }
}