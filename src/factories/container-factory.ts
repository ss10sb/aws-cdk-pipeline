import {
    ContainerDefinition,
    ContainerDefinitionOptions,
    ContainerDependency,
    ContainerDependencyCondition,
    ContainerImage,
    LogDriver,
    Secret,
    TaskDefinition
} from "@aws-cdk/aws-ecs";
import {Construct, RemovalPolicy} from "@aws-cdk/core";
import {Secrets} from "../secrets";
import {LogGroup, RetentionDays} from "@aws-cdk/aws-logs";
import {ContainerProps, ContainerType} from "../definitions/containers";
import {CommandFactory} from "./command-factory";
import {Command, EntryPoint} from "../definitions/commands";
import {AbstractFactory} from "./abstract-factory";
import {TaskServiceType} from "../definitions/tasks-services";
import {Repositories, RepositoryType} from "./repositories";

export interface ContainerFactoryProps {
    readonly repositories: Repositories;
    readonly secretKeys?: string[];
    readonly environment?: { [key: string]: string };
    readonly commandFactory: CommandFactory;
    readonly secrets: Secrets;
}

interface ContainerDependencies {
    dependencies: ContainerDependency[];
    dependsOn: ContainerDefinition[];
}

class ContainerDependencyFactory {
    containerDependencies: ContainerDependencies;

    constructor() {
        this.containerDependencies = {
            dependencies: [],
            dependsOn: [],
        }
    }

    add(container: ContainerDefinition, isDependency: boolean, dependsOn: boolean, condition: ContainerDependencyCondition = ContainerDependencyCondition.COMPLETE): void {
        if (isDependency) {
            this.addDependency(container, condition);
        }
        if (!isDependency && dependsOn) {
            this.addDependsOn(container);
        }
    }

    handle(): void {
        if (this.containerDependencies.dependencies.length > 0) {
            for (const dependsOnContainer of this.containerDependencies.dependsOn) {
                dependsOnContainer.addContainerDependencies(...this.containerDependencies.dependencies);
            }
        }
    }

    addDependency(container: ContainerDefinition, condition: ContainerDependencyCondition = ContainerDependencyCondition.COMPLETE): void {
        this.containerDependencies.dependencies.push({
            container: container,
            condition: condition
        });
    }

    addDependsOn(container: ContainerDefinition): void {
        this.containerDependencies.dependsOn.push(container);
    }
}

export class ContainerFactory extends AbstractFactory {
    readonly props: ContainerFactoryProps;
    readonly defaults: { [key: string]: any };

    constructor(scope: Construct, id: string, props: ContainerFactoryProps) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            essential: true
        }
    }

    create(type: TaskServiceType, taskDefinition: TaskDefinition, props: ContainerProps[]): ContainerDefinition[] {
        let defs: ContainerDefinition[] = [];
        const depFactory = this.newDependencyFactory();
        for (const containerProps of props) {
            const containerType = this.getType(containerProps);
            if (!this.canCreate(type, containerType)) {
                continue;
            }
            const name = this.naming.next(this.mixNameWithId(`container-${containerProps.image}-${type}-${containerType}`));
            const c = taskDefinition.addContainer(name, this.getContainerOptions(name, containerProps))
            depFactory.add(c, containerProps.dependency ?? false, containerProps.dependsOn ?? false);
            defs.push(c);
        }
        depFactory.handle();
        return defs;
    }

    canCreate(taskServiceType: TaskServiceType, containerType: ContainerType): boolean {
        const tasks = [TaskServiceType.TASK, TaskServiceType.SCHEDULED_TASK, TaskServiceType.CREATE_RUN_ONCE_TASK, TaskServiceType.RUN_ONCE_TASK, TaskServiceType.UPDATE_RUN_ONCE_TASK];
        const services = [TaskServiceType.WEB_SERVICE];
        const allowedTasks = [ContainerType.UNDEFINED, ContainerType.CREATE_RUN_ONCE_TASK, ContainerType.UPDATE_RUN_ONCE_TASK, ContainerType.RUN_ONCE_TASK, ContainerType.SCHEDULED_TASK];
        const allowedServices = [ContainerType.UNDEFINED, ContainerType.SERVICE]
        const msg = `Task/Service type '${taskServiceType}' does not allow '${containerType}'.`;
        if (tasks.includes(taskServiceType) && !allowedTasks.includes(containerType)) {
            console.log(msg);
            return false;
        }
        if (services.includes(taskServiceType) && !allowedServices.includes(containerType)) {
            console.log(msg);
            return false;
        }
        return true;
    }

    newDependencyFactory(): ContainerDependencyFactory {
        return new ContainerDependencyFactory();
    }

    getCommandFactory(): CommandFactory {
        return this.props.commandFactory;
    }

    private getType(props: ContainerProps): ContainerType {
        if (props.type) {
            return props.type;
        }
        return ContainerType.UNDEFINED;
    }

    private getContainerOptions(name: string, containerProps: ContainerProps): ContainerDefinitionOptions {
        let options: { [key: string]: any } = {
            image: this.getContainerImage(containerProps.image),
            cpu: containerProps.cpu,
            memoryLimitMiB: containerProps.memoryLimitMiB,
            essential: containerProps.essential ?? this.defaults.essential,
            logging: this.getLogging(name, containerProps),
            secrets: this.getEcsSecrets(containerProps.hasSecrets ?? false),
            environment: this.getEnvironment(containerProps.hasEnv ?? false),
        };
        this.setEntryPointAndCommandProperties(containerProps, options);
        if (containerProps.portMappings) {
            options['portMappings'] = containerProps.portMappings;
        }
        return <ContainerDefinitionOptions>options;
    }

    private setEntryPointAndCommandProperties(props: ContainerProps, options: { [key: string]: any }): void {
        if (props.entryPoint !== undefined || props.command !== undefined) {
            const cmd = this.getCommandFactory().create(props.entryPoint ?? EntryPoint.UNDEFINED, props.command ?? Command.UNDEFINED, props.additionalCommand ?? []);
            if (cmd.entryPoint) {
                options['entryPoint'] = cmd.entryPoint;
            }
            if (cmd.command) {
                options['command'] = cmd.command;
            }
        }
    }

    private getContainerImage(name: RepositoryType): ContainerImage {
        return this.props.repositories.getContainerImage(name);
        //return ContainerImage.fromEcrRepository(this.props.repositories.getByName(name), imageTag);
        //return ContainerImage.fromRegistry(this.props.repositories.getByName(name).repositoryUri + ':' + imageTag);
    }

    private getEcsSecrets(hasSecrets: boolean): { [key: string]: Secret } {
        if (hasSecrets) {
            return this.getSecrets().getEcsSecrets(this.props.secretKeys ?? []);
        }
        return {};
    }

    private getSecrets(): Secrets {
        return this.props.secrets;
    }

    private getEnvironment(hasEnvironment: boolean): { [key: string]: string } {
        if (hasEnvironment && this.props.environment) {
            return this.props.environment;
        }
        return {};
    }

    private getLogging(name: string, props: ContainerProps): LogDriver {
        const lgName = `${name}-log-group`;
        return LogDriver.awsLogs({
            streamPrefix: props.image,
            logGroup: new LogGroup(this.scope, lgName, {
                logGroupName: lgName,
                removalPolicy: RemovalPolicy.DESTROY,
                retention: RetentionDays.ONE_MONTH
            })
        });
    }
}
