import {Construct} from "@aws-cdk/core";
import {
    ApplicationListenerRule,
    IApplicationListener,
    IApplicationTargetGroup,
    ListenerCondition
} from "@aws-cdk/aws-elasticloadbalancingv2";
import {NonConstruct} from "@smorken/cdk-utils";

export interface ListenerRuleProps {
    priority: number;
    conditions: { [key: string]: any }
}


export class AlbListenerRule extends NonConstruct {
    readonly listener: IApplicationListener;
    readonly listenerRule: ListenerRuleProps;
    readonly map: { [key: string]: any };

    constructor(scope: Construct, id: string, listener: IApplicationListener, listenerRule: ListenerRuleProps) {
        super(scope, id);
        this.listener = listener;
        this.listenerRule = listenerRule;
        this.map = {
            hostHeaders: ListenerCondition.hostHeaders,
            httpHeader: ListenerCondition.httpHeader,
            httpRequestMethods: ListenerCondition.httpRequestMethods,
            pathPatterns: ListenerCondition.pathPatterns,
            queryStrings: ListenerCondition.queryStrings,
            sourceIps: ListenerCondition.sourceIps
        }
    }

    createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule {
        const name = `${this.id}-${this.listenerRule.priority}`;
        return new ApplicationListenerRule(this.scope, name, {
            priority: this.listenerRule.priority,
            conditions: this.createConditions(),
            listener: this.listener,
            targetGroups: [targetGroup]
        });
    }

    private createConditions(): ListenerCondition[] {
        let conditions: ListenerCondition[] = [];
        for (const [k, v] of Object.entries(this.listenerRule.conditions)) {
            conditions.push(this.getCondition(k, v));
        }
        return conditions;
    }

    private getCondition(type: string, props: any): ListenerCondition {
        return this.map[type](props);
    }
}
