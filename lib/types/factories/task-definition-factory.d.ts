import { Construct } from "@aws-cdk/core";
import { TaskDefinition } from "@aws-cdk/aws-ecs";
import { TaskDefinitionProps, TaskServiceType } from "../definitions/tasks-services";
import { ContainerFactory } from "./container-factory";
import { AbstractFactory } from "./abstract-factory";
export interface TaskDefinitionFactoryProps {
    readonly containerFactory: ContainerFactory;
}
export declare class TaskDefinitionFactory extends AbstractFactory {
    readonly defaults: {
        [key: string]: any;
    };
    readonly props: TaskDefinitionFactoryProps;
    constructor(scope: Construct, id: string, props: TaskDefinitionFactoryProps);
    create(type: TaskServiceType, props: TaskDefinitionProps): TaskDefinition;
    getContainerFactory(): ContainerFactory;
}
