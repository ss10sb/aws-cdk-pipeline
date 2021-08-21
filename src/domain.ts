import {Construct, Duration} from "@aws-cdk/core";
import {ARecord, HostedZone, IHostedZone, RecordTarget} from "@aws-cdk/aws-route53";
import {IApplicationLoadBalancer} from "@aws-cdk/aws-elasticloadbalancingv2";
import {LoadBalancerTarget} from "@aws-cdk/aws-route53-targets";

export class Domain extends Construct {

    readonly alb: IApplicationLoadBalancer;
    readonly hostedZone?: string;

    constructor(scope: Construct, id: string, alb: IApplicationLoadBalancer, hostedZone?: string) {
        super(scope, id);
        this.alb = alb;
        this.hostedZone = hostedZone;
    }

    createARecord(subdomain?: string): ARecord | null {
        const zone = this.getZone();
        if (zone && subdomain) {
            return new ARecord(this, `${this.node.id}-arecord`, {
                recordName: `${subdomain}.${this.hostedZone}`,
                target: RecordTarget.fromAlias(new LoadBalancerTarget(this.alb)),
                ttl: Duration.seconds(300),
                zone: zone,
                comment: this.node.id
            });
        }
        return null;
    }

    getZone(): IHostedZone | null {
        if (this.hostedZone) {
            return HostedZone.fromLookup(this, 'hosted-zone', {
                domainName: this.hostedZone
            });
        }
        return null;
    }
}
