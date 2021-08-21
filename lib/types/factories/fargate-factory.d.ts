import { ServiceFactory } from "./service-factory";
import { TaskFactory } from "./task-factory";
import { QueueProps, QueueWrapper, ServiceProps, ServiceWrapper, TaskProps, TaskWrapper } from "../definitions/tasks-services";
import { Construct } from "@aws-cdk/core";
import { AbstractFactory } from "./abstract-factory";
import { QueueFactory } from "./queue-factory";
export declare enum FargateFactories {
    COMMANDS = "commands",
    CONTAINERS = "containers",
    QUEUES = "queues",
    SERVICES = "services",
    TASKDEFINITIONS = "taskdefinitions",
    TASKS = "tasks"
}
export interface FargateFactoryProps {
    commandFactoryProps: {
        [key: string]: any;
    };
    containerFactoryProps: {
        [key: string]: any;
    };
    queueFactoryProps: {
        [key: string]: any;
    };
    serviceFactoryProps: {
        [key: string]: any;
    };
    taskDefinitionFactoryProps: {
        [key: string]: any;
    };
    taskFactoryProps: {
        [key: string]: any;
    };
}
export interface FargateTasksServices {
    tasks: TaskWrapper[];
    services: ServiceWrapper[];
    queue?: QueueWrapper;
}
export declare class FargateFactory extends AbstractFactory {
    readonly props: FargateFactoryProps;
    factories: {
        [key in FargateFactories]: AbstractFactory;
    };
    constructor(scope: Construct, id: string, props: FargateFactoryProps);
    create(tasks: TaskProps[], services: ServiceProps[], queueProps?: QueueProps): FargateTasksServices;
    getFactory(factory: FargateFactories): any;
    getQueueFactory(): QueueFactory;
    getServiceFactory(): ServiceFactory;
    getTaskFactory(): TaskFactory;
    private initFactories;
}
