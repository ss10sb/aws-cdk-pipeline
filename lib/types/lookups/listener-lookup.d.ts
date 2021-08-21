import { Construct } from "@aws-cdk/core";
import { Config } from "@smorken/cdk-utils";
import { IApplicationListener } from "@aws-cdk/aws-elasticloadbalancingv2";
export declare class ListenerLookup {
    static getApplicationListener(scope: Construct, config: Config, albArn: string): IApplicationListener;
}
