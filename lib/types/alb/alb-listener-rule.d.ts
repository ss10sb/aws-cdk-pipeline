import { Construct } from "@aws-cdk/core";
import { ApplicationListenerRule, IApplicationListener, IApplicationTargetGroup } from "@aws-cdk/aws-elasticloadbalancingv2";
import { NonConstruct } from "@smorken/cdk-utils";
export interface ListenerRuleProps {
    priority: number;
    conditions: {
        [key: string]: any;
    };
}
export declare class AlbListenerRule extends NonConstruct {
    readonly listener: IApplicationListener;
    readonly listenerRule: ListenerRuleProps;
    readonly map: {
        [key: string]: any;
    };
    constructor(scope: Construct, id: string, listener: IApplicationListener, listenerRule: ListenerRuleProps);
    createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule;
    private createConditions;
    private getCondition;
}
