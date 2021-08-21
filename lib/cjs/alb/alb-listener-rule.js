"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbListenerRule = void 0;
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk_utils_1 = require("@smorken/cdk-utils");
class AlbListenerRule extends cdk_utils_1.NonConstruct {
    constructor(scope, id, listener, listenerRule) {
        super(scope, id);
        this.listener = listener;
        this.listenerRule = listenerRule;
        this.map = {
            hostHeaders: aws_elasticloadbalancingv2_1.ListenerCondition.hostHeaders,
            httpHeader: aws_elasticloadbalancingv2_1.ListenerCondition.httpHeader,
            httpRequestMethods: aws_elasticloadbalancingv2_1.ListenerCondition.httpRequestMethods,
            pathPatterns: aws_elasticloadbalancingv2_1.ListenerCondition.pathPatterns,
            queryStrings: aws_elasticloadbalancingv2_1.ListenerCondition.queryStrings,
            sourceIps: aws_elasticloadbalancingv2_1.ListenerCondition.sourceIps
        };
    }
    createListenerRule(targetGroup) {
        const name = `${this.id}-${this.listenerRule.priority}`;
        return new aws_elasticloadbalancingv2_1.ApplicationListenerRule(this.scope, name, {
            priority: this.listenerRule.priority,
            conditions: this.createConditions(),
            listener: this.listener,
            targetGroups: [targetGroup]
        });
    }
    createConditions() {
        let conditions = [];
        for (const [k, v] of Object.entries(this.listenerRule.conditions)) {
            conditions.push(this.getCondition(k, v));
        }
        return conditions;
    }
    getCondition(type, props) {
        return this.map[type](props);
    }
}
exports.AlbListenerRule = AlbListenerRule;
//# sourceMappingURL=alb-listener-rule.js.map