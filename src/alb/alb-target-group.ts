import {Construct} from "@aws-cdk/core";
import {IVpc} from "@aws-cdk/aws-ec2";
import {
    ApplicationProtocol,
    ApplicationTargetGroup,
    IApplicationTargetGroup,
    TargetType
} from "@aws-cdk/aws-elasticloadbalancingv2";
import {NonConstruct} from "@smorken/cdk-utils";
import {EnvConfig} from "../definitions/env-config";

export interface TargetGroupProps {
    readonly port?: number;
    readonly protocol?: ApplicationProtocol;
    readonly targetType?: TargetType;
}

export class AlbTargetGroup extends NonConstruct {
    readonly vpc: IVpc;
    readonly config: EnvConfig;

    constructor(scope: Construct, id: string, vpc: IVpc, config: EnvConfig) {
        super(scope, id);
        this.vpc = vpc;
        this.config = config;
    }

    createApplicationTargetGroup(): IApplicationTargetGroup {
        const props = this.config.Parameters.targetGroup ?? {};
        const targetGroup = new ApplicationTargetGroup(this.scope, this.id, {
            port: props.port ?? 80,
            vpc: this.vpc,
            protocol: props.protocol ?? ApplicationProtocol.HTTP,
            targetType: props.targetType ?? TargetType.IP,
            targetGroupName: this.id
        });
        this.configureHealthCheck(targetGroup);
        return targetGroup;
    }

    private configureHealthCheck(targetGroup: ApplicationTargetGroup): void {
        const healthCheck = this.config.Parameters.healthCheck;
        if (healthCheck) {
            targetGroup.configureHealthCheck(healthCheck);
        }
    }
}
