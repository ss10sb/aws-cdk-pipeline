import {AlbUtils, Config} from "@smorken/cdk-utils";
import {IApplicationLoadBalancer} from "@aws-cdk/aws-elasticloadbalancingv2";
import {Construct} from "@aws-cdk/core";

export class AlbLookup {

    public static getAlb(scope: Construct, config: Config, albArn: string): IApplicationLoadBalancer {
        return AlbUtils.getAlbByArn(scope, albArn);
    }

    public static getAlbArnParamKey(config: Config, name: string = 'alb01'): string {
        return `${AlbUtils.getDefaultAlbName(config, name)}-arn`;
    }

    public static getAlbArn(scope: Construct, arnParamKey: string): string {
        return AlbUtils.getArnFromParams(scope, arnParamKey);
    }
}
