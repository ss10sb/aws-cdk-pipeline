import {NonConstruct} from "@smorken/cdk-utils";
import * as lambda from '@aws-cdk/aws-lambda';
import {Code, Runtime} from "@aws-cdk/aws-lambda";
import {Construct, Duration} from "@aws-cdk/core";
import * as path from "path";

export interface StartStopFunctionProps {
    readonly memorySize?: number;
    readonly timeout?: number;
    readonly runtime?: Runtime;
    readonly handler?: string;
    readonly code?: string;
}

export class StartStopFunction extends NonConstruct {

    readonly props: StartStopFunctionProps;
    readonly function: lambda.Function;
    readonly defaults: { [key: string]: any };

    constructor(scope: Construct, id: string, props: StartStopFunctionProps) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            memorySize: 128,
            timeout: 5,
            runtime: Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: Code.fromAsset(path.join(__dirname, '/lambda'))
        };
        this.function = this.create();
    }

    protected create(): lambda.Function {
        return new lambda.Function(this.scope, this.mixNameWithId('start-stop-lambda'), {
            memorySize: this.props.memorySize ?? this.defaults.memorySize,
            timeout: Duration.seconds(this.props.timeout ?? this.defaults.timeout),
            runtime: this.props.runtime ?? this.defaults.runtime,
            handler: this.props.handler ?? this.defaults.handler,
            code: this.props.code ?? this.defaults.code
        });
    }
}