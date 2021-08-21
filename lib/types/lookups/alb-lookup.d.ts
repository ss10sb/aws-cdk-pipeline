import { Config } from "@smorken/cdk-utils";
import { IApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import { Construct } from "@aws-cdk/core";
export declare class AlbLookup {
    static getAlb(scope: Construct, config: Config, albArn: string): IApplicationLoadBalancer;
    static getAlbArnParamKey(config: Config, name?: string): string;
    static getAlbArn(scope: Construct, arnParamKey: string): string;
}
