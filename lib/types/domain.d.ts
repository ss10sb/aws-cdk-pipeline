import { Construct } from "@aws-cdk/core";
import { ARecord, IHostedZone } from "@aws-cdk/aws-route53";
import { IApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
export declare class Domain extends Construct {
    readonly alb: IApplicationLoadBalancer;
    readonly hostedZone?: string;
    constructor(scope: Construct, id: string, alb: IApplicationLoadBalancer, hostedZone?: string);
    createARecord(subdomain?: string): ARecord | null;
    getZone(): IHostedZone | null;
}
