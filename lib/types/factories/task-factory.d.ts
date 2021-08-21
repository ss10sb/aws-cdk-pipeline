import { Construct } from "@aws-cdk/core";
import { Cluster } from "@aws-cdk/aws-ecs";
import { TaskProps, TaskWrapper } from "../definitions/tasks-services";
import { AbstractFactory } from "./abstract-factory";
import { TaskDefinitionFactory } from "./task-definition-factory";
export interface TaskFactoryProps {
    readonly cluster: Cluster;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}
export declare class TaskFactory extends AbstractFactory {
    readonly defaults: {
        [key: string]: any;
    };
    readonly props: TaskFactoryProps;
    constructor(scope: Construct, id: string, props: TaskFactoryProps);
    create(tasks: TaskProps[]): TaskWrapper[];
    getTaskDefinitionFactory(): TaskDefinitionFactory;
    private createFromTask;
    private createRunOnceOnCreate;
    private createRunOnceOnUpdate;
    private createRunOnceOnCreateAndUpdate;
    private createRunOnce;
    private createScheduledTask;
    private getSchedule;
    private getTaskName;
}
