import { TaskDefinitionFactory } from "./task-definition-factory";
import { Construct } from "@aws-cdk/core";
import { Cluster } from "@aws-cdk/aws-ecs";
import { ServiceProps, ServiceWrapper } from "../definitions/tasks-services";
import { IApplicationTargetGroup } from "@aws-cdk/aws-elasticloadbalancingv2";
import { AbstractFactory } from "./abstract-factory";
export interface ServiceFactoryProps {
    readonly cluster: Cluster;
    readonly targetGroup: IApplicationTargetGroup;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}
export declare class ServiceFactory extends AbstractFactory {
    readonly defaults: {
        [key: string]: any;
    };
    readonly props: ServiceFactoryProps;
    constructor(scope: Construct, id: string, props: ServiceFactoryProps);
    create(services: ServiceProps[]): ServiceWrapper[];
    getTaskDefinitionFactory(): TaskDefinitionFactory;
    private createService;
    private createStandardService;
    private scalableTarget;
    private addScaling;
}
