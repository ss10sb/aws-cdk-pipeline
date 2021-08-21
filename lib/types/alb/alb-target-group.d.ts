import { Construct } from "@aws-cdk/core";
import { IVpc } from "@aws-cdk/aws-ec2";
import { ApplicationProtocol, IApplicationTargetGroup, TargetType } from "@aws-cdk/aws-elasticloadbalancingv2";
import { NonConstruct } from "@smorken/cdk-utils";
import { EnvConfig } from "../definitions/env-config";
export interface TargetGroupProps {
    readonly port?: number;
    readonly protocol?: ApplicationProtocol;
    readonly targetType?: TargetType;
}
export declare class AlbTargetGroup extends NonConstruct {
    readonly vpc: IVpc;
    readonly config: EnvConfig;
    constructor(scope: Construct, id: string, vpc: IVpc, config: EnvConfig);
    createApplicationTargetGroup(): IApplicationTargetGroup;
    private configureHealthCheck;
}
