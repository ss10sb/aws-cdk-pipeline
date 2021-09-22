import { NonConstruct } from "@smorken/cdk-utils";
import * as lambda from '@aws-cdk/aws-lambda';
import { Runtime } from '@aws-cdk/aws-lambda';
import { Construct } from "@aws-cdk/core";
import { ICluster } from "@aws-cdk/aws-ecs";
export interface StartStopFunctionProps {
    readonly memorySize?: number;
    readonly timeout?: number;
    readonly runtime?: Runtime;
    readonly handler?: string;
    readonly code?: string;
    cluster?: ICluster;
}
export declare class StartStopFunction extends NonConstruct {
    readonly props: StartStopFunctionProps;
    readonly function: lambda.Function;
    readonly defaults: {
        [key: string]: any;
    };
    constructor(scope: Construct, id: string, props: StartStopFunctionProps);
    protected create(): lambda.Function;
}
