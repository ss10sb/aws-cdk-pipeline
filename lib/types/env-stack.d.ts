import { ConfigStack, ConfigStackProps } from "@smorken/cdk-utils";
import { IVpc } from "@aws-cdk/aws-ec2";
import { IApplicationListener, IApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import { EnvConfig, EnvProps } from "./definitions/env-config";
import { Construct, StackProps } from "@aws-cdk/core";
export declare class EnvStack<T extends EnvConfig> extends ConfigStack<T> {
    alb: IApplicationLoadBalancer;
    envProps: EnvProps;
    listener: IApplicationListener;
    vpc: IVpc;
    constructor(scope: Construct, id: string, stackProps: StackProps, config: T, envProps: EnvProps, configStackProps?: ConfigStackProps);
    exec(): void;
    private createARecord;
    private createSesVerifyDomain;
    private createCluster;
    private createQueues;
    private createDeadLetterQueue;
    private createDefaultQueue;
    private createDynamoDbTable;
    private createS3Bucket;
    private createListenerRule;
    private createTasksAndServices;
    private createTargetGroup;
    private getEnvironmentForContainers;
    private getName;
    private handleLookups;
}
