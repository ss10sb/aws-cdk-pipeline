import { Construct } from "@aws-cdk/core";
import { Connections, IConnectable, ISecurityGroup, IVpc } from "@aws-cdk/aws-ec2";
import { AwsCustomResource } from "@aws-cdk/custom-resources";
import { FargatePlatformVersion, FargateTaskDefinition, ICluster } from "@aws-cdk/aws-ecs";
export interface RunTaskProps {
    readonly vpc?: IVpc;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;
    readonly securityGroup?: ISecurityGroup;
    readonly fargatePlatformVersion?: FargatePlatformVersion;
    readonly runOnUpdate?: boolean;
    readonly runOnCreate?: boolean;
}
export declare class RunTask extends Construct implements IConnectable {
    readonly resource?: AwsCustomResource;
    readonly connections: Connections;
    readonly vpc: IVpc;
    readonly securityGroup: ISecurityGroup;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;
    constructor(scope: Construct, id: string, props: RunTaskProps);
    protected getName(props: RunTaskProps): string;
}
