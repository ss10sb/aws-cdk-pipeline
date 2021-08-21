"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domain = void 0;
const core_1 = require("@aws-cdk/core");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const aws_route53_targets_1 = require("@aws-cdk/aws-route53-targets");
class Domain extends core_1.Construct {
    constructor(scope, id, alb, hostedZone) {
        super(scope, id);
        this.alb = alb;
        this.hostedZone = hostedZone;
    }
    createARecord(subdomain) {
        const zone = this.getZone();
        if (zone && subdomain) {
            return new aws_route53_1.ARecord(this, `${this.node.id}-arecord`, {
                recordName: `${subdomain}.${this.hostedZone}`,
                target: aws_route53_1.RecordTarget.fromAlias(new aws_route53_targets_1.LoadBalancerTarget(this.alb)),
                ttl: core_1.Duration.seconds(300),
                zone: zone,
                comment: this.node.id
            });
        }
        return null;
    }
    getZone() {
        if (this.hostedZone) {
            return aws_route53_1.HostedZone.fromLookup(this, 'hosted-zone', {
                domainName: this.hostedZone
            });
        }
        return null;
    }
}
exports.Domain = Domain;
//# sourceMappingURL=domain.js.map