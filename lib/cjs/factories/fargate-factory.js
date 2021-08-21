"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FargateFactory = exports.FargateFactories = void 0;
const service_factory_1 = require("./service-factory");
const task_factory_1 = require("./task-factory");
const command_factory_1 = require("./command-factory");
const container_factory_1 = require("./container-factory");
const task_definition_factory_1 = require("./task-definition-factory");
const abstract_factory_1 = require("./abstract-factory");
const queue_factory_1 = require("./queue-factory");
var FargateFactories;
(function (FargateFactories) {
    FargateFactories["COMMANDS"] = "commands";
    FargateFactories["CONTAINERS"] = "containers";
    FargateFactories["QUEUES"] = "queues";
    FargateFactories["SERVICES"] = "services";
    FargateFactories["TASKDEFINITIONS"] = "taskdefinitions";
    FargateFactories["TASKS"] = "tasks";
})(FargateFactories = exports.FargateFactories || (exports.FargateFactories = {}));
class FargateFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.factories = this.initFactories();
    }
    create(tasks, services, queueProps) {
        let allservices = {
            tasks: this.getTaskFactory().create(tasks),
            services: this.getServiceFactory().create(services),
            queue: undefined
        };
        if (queueProps) {
            allservices.queue = this.getQueueFactory().create(queueProps);
        }
        return allservices;
    }
    getFactory(factory) {
        return this.factories[factory];
    }
    getQueueFactory() {
        return this.getFactory(FargateFactories.QUEUES);
    }
    getServiceFactory() {
        return this.getFactory(FargateFactories.SERVICES);
    }
    getTaskFactory() {
        return this.getFactory(FargateFactories.TASKS);
    }
    initFactories() {
        let factories = {};
        factories[FargateFactories.COMMANDS] = new command_factory_1.CommandFactory(this.scope, this.id, this.props.commandFactoryProps);
        this.props.containerFactoryProps.commandFactory = factories[FargateFactories.COMMANDS];
        this.props.queueFactoryProps.commandFactory = factories[FargateFactories.COMMANDS];
        factories[FargateFactories.CONTAINERS] = new container_factory_1.ContainerFactory(this.scope, this.id, this.props.containerFactoryProps);
        this.props.taskDefinitionFactoryProps.containerFactory = factories[FargateFactories.CONTAINERS];
        factories[FargateFactories.QUEUES] = new queue_factory_1.QueueFactory(this.scope, this.id, this.props.queueFactoryProps);
        factories[FargateFactories.TASKDEFINITIONS] = new task_definition_factory_1.TaskDefinitionFactory(this.scope, this.id, this.props.taskDefinitionFactoryProps);
        this.props.serviceFactoryProps.taskDefinitionFactory = factories[FargateFactories.TASKDEFINITIONS];
        this.props.taskFactoryProps.taskDefinitionFactory = factories[FargateFactories.TASKDEFINITIONS];
        factories[FargateFactories.SERVICES] = new service_factory_1.ServiceFactory(this.scope, this.id, this.props.serviceFactoryProps);
        factories[FargateFactories.TASKS] = new task_factory_1.TaskFactory(this.scope, this.id, this.props.taskFactoryProps);
        return factories;
    }
}
exports.FargateFactory = FargateFactory;
//# sourceMappingURL=fargate-factory.js.map