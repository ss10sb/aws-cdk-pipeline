import {NonConstruct} from "@smorken/cdk-utils";
import * as lambda from '@aws-cdk/aws-lambda';
import {Rule, RuleTargetInput, Schedule} from "@aws-cdk/aws-events";
import {LambdaFunction} from "@aws-cdk/aws-events-targets";
import {Construct} from "@aws-cdk/core";

export interface StopStartEventProps {
    readonly lambdaFunction: lambda.Function;
}

export interface LambdaEventProps {
    readonly clusterArn: string;
    readonly status: LambdaEventStatus;
    readonly schedule: string;
}

export enum LambdaEventStatus {
    START = 'start',
    STOP = 'stop'
}

export class StartStopEvent extends NonConstruct {
    readonly props: StopStartEventProps;
    rules: Rule[];

    constructor(scope: Construct, id: string, props: StopStartEventProps) {
        super(scope, id);
        this.props = props;
        this.rules = [];
    }

    public create(props: LambdaEventProps): Rule {
        const rule: Rule = new Rule(this.scope, this.mixNameWithId(`start-stop-${props.status}-rule`), {
            schedule: Schedule.expression(props.schedule),
        });
        rule.addTarget(new LambdaFunction(this.props.lambdaFunction, {
            event: RuleTargetInput.fromObject({
                cluster: props.clusterArn,
                status: props.status
            })
        }));
        this.rules.push(rule);
        return rule;
    }
}