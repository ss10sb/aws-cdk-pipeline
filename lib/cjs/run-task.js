"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunTask = void 0;
const core_1 = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_logs_1 = require("@aws-cdk/aws-logs");
class RunTask extends core_1.Construct {
    constructor(scope, id, props) {
        var _a, _b;
        super(scope, id);
        this.vpc = (_a = props.vpc) !== null && _a !== void 0 ? _a : props.cluster.vpc;
        this.cluster = props.cluster;
        this.taskDefinition = props.taskDefinition;
        this.securityGroup = (_b = props.securityGroup) !== null && _b !== void 0 ? _b : new aws_ec2_1.SecurityGroup(this, `${this.node.id}-security-group`, { vpc: this.vpc });
        this.connections = new aws_ec2_1.Connections({ securityGroups: [this.securityGroup] });
        const onEvent = {
            service: 'ECS',
            action: 'runTask',
            physicalResourceId: custom_resources_1.PhysicalResourceId.of(this.taskDefinition.taskDefinitionArn),
            parameters: {
                cluster: this.cluster.clusterName,
                taskDefinition: this.taskDefinition.taskDefinitionArn,
                capacityProviderStrategy: [],
                launchType: aws_ecs_1.LaunchType.FARGATE,
                platformVersion: props.fargatePlatformVersion,
                networkConfiguration: {
                    awsvpcConfiguration: {
                        assignPublicIp: 'DISABLED',
                        subnets: this.vpc.selectSubnets({
                            subnetType: aws_ec2_1.SubnetType.PRIVATE
                        }).subnetIds,
                        securityGroups: [this.securityGroup.securityGroupId]
                    }
                }
            }
        };
        const name = this.getName(props);
        this.resource = new custom_resources_1.AwsCustomResource(this, name, {
            onCreate: props.runOnCreate ? onEvent : undefined,
            onUpdate: props.runOnUpdate ? onEvent : undefined,
            policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: [this.taskDefinition.taskDefinitionArn] }),
            logRetention: aws_logs_1.RetentionDays.ONE_WEEK,
            functionName: name
        });
        this.taskDefinition.taskRole.grantPassRole(this.resource.grantPrincipal);
        this.taskDefinition.obtainExecutionRole().grantPassRole(this.resource.grantPrincipal);
    }
    getName(props) {
        let parts = [this.node.id, 'run-ecs-task'];
        if (props.runOnCreate) {
            parts.push('create');
        }
        if (props.runOnUpdate) {
            parts.push('update');
        }
        return parts.join('-');
    }
}
exports.RunTask = RunTask;
//# sourceMappingURL=run-task.js.map