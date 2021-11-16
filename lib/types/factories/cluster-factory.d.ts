import { Construct } from "@aws-cdk/core";
import { Cluster } from "@aws-cdk/aws-ecs";
import { IVpc } from "@aws-cdk/aws-ec2";
import { AbstractFactory } from "./abstract-factory";
export interface ClusterFactoryProps {
    alarmEmails?: string[];
    vpc: IVpc;
    securityGroupIds?: string[];
    containerInsights?: boolean;
}
export declare class ClusterFactory extends AbstractFactory {
    readonly props: ClusterFactoryProps;
    constructor(scope: Construct, id: string, props: ClusterFactoryProps);
    create(): Cluster;
    private createAlarms;
    private addActions;
    private addSubscriptions;
}
