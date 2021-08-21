"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerLookup = void 0;
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
class ListenerLookup {
    static getApplicationListener(scope, config, albArn) {
        const lookupOptions = {
            loadBalancerArn: albArn,
            listenerPort: 443,
            listenerProtocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS
        };
        return aws_elasticloadbalancingv2_1.ApplicationListener.fromLookup(scope, 'lookup-https-listener', lookupOptions);
    }
}
exports.ListenerLookup = ListenerLookup;
//# sourceMappingURL=listener-lookup.js.map