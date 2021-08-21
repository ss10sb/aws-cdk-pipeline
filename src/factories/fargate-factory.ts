import {ServiceFactory, ServiceFactoryProps} from "./service-factory";
import {TaskFactory, TaskFactoryProps} from "./task-factory";
import {
    QueueProps,
    QueueWrapper,
    ServiceProps,
    ServiceWrapper,
    TaskProps,
    TaskWrapper
} from "../definitions/tasks-services";
import {CommandFactory, CommandFactoryProps} from "./command-factory";
import {ContainerFactory, ContainerFactoryProps} from "./container-factory";
import {TaskDefinitionFactory, TaskDefinitionFactoryProps} from "./task-definition-factory";
import {Construct} from "@aws-cdk/core";
import {AbstractFactory} from "./abstract-factory";
import {QueueFactory, QueueFactoryProps} from "./queue-factory";

export enum FargateFactories {
    COMMANDS = 'commands',
    CONTAINERS = 'containers',
    QUEUES = 'queues',
    SERVICES = 'services',
    TASKDEFINITIONS = 'taskdefinitions',
    TASKS = 'tasks'
}

export interface FargateFactoryProps {
    commandFactoryProps: { [key: string]: any };
    containerFactoryProps: { [key: string]: any };
    queueFactoryProps: { [key: string]: any };
    serviceFactoryProps: { [key: string]: any };
    taskDefinitionFactoryProps: { [key: string]: any };
    taskFactoryProps: { [key: string]: any };
}

export interface FargateTasksServices {
    tasks: TaskWrapper[];
    services: ServiceWrapper[];
    queue?: QueueWrapper;
}

export class FargateFactory extends AbstractFactory {
    readonly props: FargateFactoryProps;
    factories: { [key in FargateFactories]: AbstractFactory };

    constructor(scope: Construct, id: string, props: FargateFactoryProps) {
        super(scope, id);
        this.props = props;
        this.factories = this.initFactories();
    }

    create(tasks: TaskProps[], services: ServiceProps[], queueProps?: QueueProps): FargateTasksServices {
        let allservices: FargateTasksServices = {
            tasks: this.getTaskFactory().create(tasks),
            services: this.getServiceFactory().create(services),
            queue: undefined
        };
        if (queueProps) {
            allservices.queue = this.getQueueFactory().create(queueProps);
        }
        return allservices;
    }

    getFactory(factory: FargateFactories): any {
        return this.factories[factory];
    }

    getQueueFactory(): QueueFactory {
        return this.getFactory(FargateFactories.QUEUES);
    }

    getServiceFactory(): ServiceFactory {
        return this.getFactory(FargateFactories.SERVICES);
    }

    getTaskFactory(): TaskFactory {
        return this.getFactory(FargateFactories.TASKS);
    }

    private initFactories(): { [key in FargateFactories]: AbstractFactory } {
        let factories: { [key: string]: AbstractFactory } = {};
        factories[FargateFactories.COMMANDS] = new CommandFactory(this.scope, this.id, <CommandFactoryProps>this.props.commandFactoryProps);
        this.props.containerFactoryProps.commandFactory = factories[FargateFactories.COMMANDS];
        this.props.queueFactoryProps.commandFactory = factories[FargateFactories.COMMANDS];
        factories[FargateFactories.CONTAINERS] = new ContainerFactory(this.scope, this.id, <ContainerFactoryProps>this.props.containerFactoryProps);
        this.props.taskDefinitionFactoryProps.containerFactory = factories[FargateFactories.CONTAINERS];
        factories[FargateFactories.QUEUES] = new QueueFactory(this.scope, this.id, <QueueFactoryProps>this.props.queueFactoryProps);
        factories[FargateFactories.TASKDEFINITIONS] = new TaskDefinitionFactory(this.scope, this.id, <TaskDefinitionFactoryProps>this.props.taskDefinitionFactoryProps);
        this.props.serviceFactoryProps.taskDefinitionFactory = factories[FargateFactories.TASKDEFINITIONS];
        this.props.taskFactoryProps.taskDefinitionFactory = factories[FargateFactories.TASKDEFINITIONS];
        factories[FargateFactories.SERVICES] = new ServiceFactory(this.scope, this.id, <ServiceFactoryProps>this.props.serviceFactoryProps);
        factories[FargateFactories.TASKS] = new TaskFactory(this.scope, this.id, <TaskFactoryProps>this.props.taskFactoryProps);
        return <{ [key in FargateFactories]: AbstractFactory }>factories;
    }
}
