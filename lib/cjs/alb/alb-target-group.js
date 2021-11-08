"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbTargetGroup = void 0;
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk_utils_1 = require("@smorken/cdk-utils");
class AlbTargetGroup extends cdk_utils_1.NonConstruct {
    constructor(scope, id, vpc, config) {
        super(scope, id);
        this.vpc = vpc;
        this.config = config;
    }
    createApplicationTargetGroup() {
        var _a, _b, _c, _d;
        const props = (_a = this.config.Parameters.targetGroup) !== null && _a !== void 0 ? _a : {};
        const targetGroup = new aws_elasticloadbalancingv2_1.ApplicationTargetGroup(this.scope, this.id, {
            port: (_b = props.port) !== null && _b !== void 0 ? _b : 80,
            vpc: this.vpc,
            protocol: (_c = props.protocol) !== null && _c !== void 0 ? _c : aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
            targetType: (_d = props.targetType) !== null && _d !== void 0 ? _d : aws_elasticloadbalancingv2_1.TargetType.IP,
            targetGroupName: this.id
        });
        this.configureHealthCheck(targetGroup);
        return targetGroup;
    }
    configureHealthCheck(targetGroup) {
        const healthCheck = this.config.Parameters.healthCheck;
        if (healthCheck) {
            targetGroup.configureHealthCheck(healthCheck);
        }
    }
}
exports.AlbTargetGroup = AlbTargetGroup;
//# sourceMappingURL=alb-target-group.js.map