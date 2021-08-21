import {Construct} from "@aws-cdk/core";
import {Connections, IConnectable, ISecurityGroup, IVpc, SecurityGroup, SubnetType} from "@aws-cdk/aws-ec2";
import {AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId} from "@aws-cdk/custom-resources";
import {FargatePlatformVersion, FargateTaskDefinition, ICluster, LaunchType} from "@aws-cdk/aws-ecs";
import {RetentionDays} from "@aws-cdk/aws-logs";

export interface RunTaskProps {
    readonly vpc?: IVpc;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;
    readonly securityGroup?: ISecurityGroup;
    readonly fargatePlatformVersion?: FargatePlatformVersion;
    readonly runOnUpdate?: boolean;
    readonly runOnCreate?: boolean;
}

export class RunTask extends Construct implements IConnectable {
    readonly resource?: AwsCustomResource;
    readonly connections: Connections;
    readonly vpc: IVpc;
    readonly securityGroup: ISecurityGroup;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;

    constructor(scope: Construct, id: string, props: RunTaskProps) {
        super(scope, id);
        this.vpc = props.vpc ?? props.cluster.vpc;
        this.cluster = props.cluster;
        this.taskDefinition = props.taskDefinition;
        this.securityGroup = props.securityGroup ?? new SecurityGroup(this, `${this.node.id}-security-group`, {vpc: this.vpc});
        this.connections = new Connections({securityGroups: [this.securityGroup]});
        const onEvent = {
            service: 'ECS',
            action: 'runTask',
            physicalResourceId: PhysicalResourceId.of(this.taskDefinition.taskDefinitionArn),
            parameters: {
                cluster: this.cluster.clusterName,
                taskDefinition: this.taskDefinition.taskDefinitionArn,
                capacityProviderStrategy: [],
                launchType: LaunchType.FARGATE,
                platformVersion: props.fargatePlatformVersion,
                networkConfiguration: {
                    awsvpcConfiguration: {
                        assignPublicIp: 'DISABLED',
                        subnets: this.vpc.selectSubnets({
                            subnetType: SubnetType.PRIVATE
                        }).subnetIds,
                        securityGroups: [this.securityGroup.securityGroupId]
                    }
                }
            }
        }
        this.resource = new AwsCustomResource(this, `${this.node.id}-ecs-run-task`, {
            onCreate: props.runOnCreate ? onEvent : undefined,
            onUpdate: props.runOnUpdate ? onEvent : undefined,
            policy: AwsCustomResourcePolicy.fromSdkCalls({resources: [this.taskDefinition.taskDefinitionArn]}),
            logRetention: RetentionDays.ONE_WEEK
        });
        this.taskDefinition.taskRole.grantPassRole(this.resource.grantPrincipal);
        this.taskDefinition.obtainExecutionRole().grantPassRole(this.resource.grantPrincipal);
    }
}
