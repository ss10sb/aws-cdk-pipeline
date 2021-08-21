import { ContainerDefinition, ContainerDependency, ContainerDependencyCondition, TaskDefinition } from "@aws-cdk/aws-ecs";
import { Construct } from "@aws-cdk/core";
import { Secrets } from "../secrets";
import { ContainerProps, ContainerType } from "../definitions/containers";
import { CommandFactory } from "./command-factory";
import { AbstractFactory } from "./abstract-factory";
import { TaskServiceType } from "../definitions/tasks-services";
import { Repositories } from "./repositories";
export interface ContainerFactoryProps {
    readonly repositories: Repositories;
    readonly secretKeys?: string[];
    readonly environment?: {
        [key: string]: string;
    };
    readonly commandFactory: CommandFactory;
    readonly secrets: Secrets;
}
interface ContainerDependencies {
    dependencies: ContainerDependency[];
    dependsOn: ContainerDefinition[];
}
declare class ContainerDependencyFactory {
    containerDependencies: ContainerDependencies;
    constructor();
    add(container: ContainerDefinition, isDependency: boolean, dependsOn: boolean, condition?: ContainerDependencyCondition): void;
    handle(): void;
    addDependency(container: ContainerDefinition, condition?: ContainerDependencyCondition): void;
    addDependsOn(container: ContainerDefinition): void;
}
export declare class ContainerFactory extends AbstractFactory {
    readonly props: ContainerFactoryProps;
    readonly defaults: {
        [key: string]: any;
    };
    constructor(scope: Construct, id: string, props: ContainerFactoryProps);
    create(type: TaskServiceType, taskDefinition: TaskDefinition, props: ContainerProps[]): ContainerDefinition[];
    canCreate(taskServiceType: TaskServiceType, containerType: ContainerType): boolean;
    newDependencyFactory(): ContainerDependencyFactory;
    getCommandFactory(): CommandFactory;
    private getType;
    private getContainerOptions;
    private setEntryPointAndCommandProperties;
    private getContainerImage;
    private getEcsSecrets;
    private getSecrets;
    private getEnvironment;
    private getLogging;
}
export {};
