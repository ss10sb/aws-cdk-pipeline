import { NonConstruct } from "@smorken/cdk-utils";
import * as lambda from '@aws-cdk/aws-lambda';
import { Rule } from "@aws-cdk/aws-events";
import { Construct } from "@aws-cdk/core";
export interface StopStartEventProps {
    readonly lambdaFunction: lambda.Function;
}
export interface LambdaEventProps {
    readonly clusterArn: string;
    readonly status: LambdaEventStatus;
    readonly schedule: string;
}
export declare enum LambdaEventStatus {
    START = "start",
    STOP = "stop"
}
export declare class StartStopEvent extends NonConstruct {
    readonly props: StopStartEventProps;
    rules: Rule[];
    constructor(scope: Construct, id: string, props: StopStartEventProps);
    create(props: LambdaEventProps): Rule;
}
