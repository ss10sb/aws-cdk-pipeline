"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerFactory = void 0;
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const core_1 = require("@aws-cdk/core");
const aws_logs_1 = require("@aws-cdk/aws-logs");
const containers_1 = require("../definitions/containers");
const commands_1 = require("../definitions/commands");
const abstract_factory_1 = require("./abstract-factory");
const tasks_services_1 = require("../definitions/tasks-services");
class ContainerDependencyFactory {
    constructor() {
        this.containerDependencies = {
            dependencies: [],
            dependsOn: [],
        };
    }
    add(container, isDependency, dependsOn, condition = aws_ecs_1.ContainerDependencyCondition.COMPLETE) {
        if (isDependency) {
            this.addDependency(container, condition);
        }
        if (!isDependency && dependsOn) {
            this.addDependsOn(container);
        }
    }
    handle() {
        if (this.containerDependencies.dependencies.length > 0) {
            for (const dependsOnContainer of this.containerDependencies.dependsOn) {
                dependsOnContainer.addContainerDependencies(...this.containerDependencies.dependencies);
            }
        }
    }
    addDependency(container, condition = aws_ecs_1.ContainerDependencyCondition.COMPLETE) {
        this.containerDependencies.dependencies.push({
            container: container,
            condition: condition
        });
    }
    addDependsOn(container) {
        this.containerDependencies.dependsOn.push(container);
    }
}
class ContainerFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            essential: true
        };
    }
    create(type, taskDefinition, props) {
        var _a, _b;
        let defs = [];
        const depFactory = this.newDependencyFactory();
        for (const containerProps of props) {
            const containerType = this.getType(containerProps);
            if (!this.canCreate(type, containerType)) {
                continue;
            }
            const name = this.naming.next(this.mixNameWithId(`container-${containerProps.image}-${type}-${containerType}`));
            const c = taskDefinition.addContainer(name, this.getContainerOptions(name, containerProps));
            depFactory.add(c, (_a = containerProps.dependency) !== null && _a !== void 0 ? _a : false, (_b = containerProps.dependsOn) !== null && _b !== void 0 ? _b : false);
            defs.push(c);
        }
        depFactory.handle();
        return defs;
    }
    canCreate(taskServiceType, containerType) {
        const tasks = [tasks_services_1.TaskServiceType.TASK, tasks_services_1.TaskServiceType.SCHEDULED_TASK, tasks_services_1.TaskServiceType.CREATE_RUN_ONCE_TASK, tasks_services_1.TaskServiceType.RUN_ONCE_TASK, tasks_services_1.TaskServiceType.UPDATE_RUN_ONCE_TASK];
        const services = [tasks_services_1.TaskServiceType.WEB_SERVICE];
        const allowedTasks = [containers_1.ContainerType.UNDEFINED, containers_1.ContainerType.CREATE_RUN_ONCE_TASK, containers_1.ContainerType.UPDATE_RUN_ONCE_TASK, containers_1.ContainerType.RUN_ONCE_TASK, containers_1.ContainerType.SCHEDULED_TASK];
        const allowedServices = [containers_1.ContainerType.UNDEFINED, containers_1.ContainerType.SERVICE];
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
    newDependencyFactory() {
        return new ContainerDependencyFactory();
    }
    getCommandFactory() {
        return this.props.commandFactory;
    }
    getType(props) {
        if (props.type) {
            return props.type;
        }
        return containers_1.ContainerType.UNDEFINED;
    }
    getContainerOptions(name, containerProps) {
        var _a, _b, _c;
        let options = {
            image: this.getContainerImage(containerProps.image),
            cpu: containerProps.cpu,
            memoryLimitMiB: containerProps.memoryLimitMiB,
            essential: (_a = containerProps.essential) !== null && _a !== void 0 ? _a : this.defaults.essential,
            logging: this.getLogging(name, containerProps),
            secrets: this.getEcsSecrets((_b = containerProps.hasSecrets) !== null && _b !== void 0 ? _b : false),
            environment: this.getEnvironment((_c = containerProps.hasEnv) !== null && _c !== void 0 ? _c : false),
        };
        this.setEntryPointAndCommandProperties(containerProps, options);
        if (containerProps.portMappings) {
            options['portMappings'] = containerProps.portMappings;
        }
        return options;
    }
    setEntryPointAndCommandProperties(props, options) {
        var _a, _b, _c;
        if (props.entryPoint !== undefined || props.command !== undefined) {
            const cmd = this.getCommandFactory().create((_a = props.entryPoint) !== null && _a !== void 0 ? _a : commands_1.EntryPoint.UNDEFINED, (_b = props.command) !== null && _b !== void 0 ? _b : commands_1.Command.UNDEFINED, (_c = props.additionalCommand) !== null && _c !== void 0 ? _c : []);
            if (cmd.entryPoint) {
                options['entryPoint'] = cmd.entryPoint;
            }
            if (cmd.command) {
                options['command'] = cmd.command;
            }
        }
    }
    getContainerImage(name) {
        return this.props.repositories.getContainerImage(name);
        //return ContainerImage.fromEcrRepository(this.props.repositories.getByName(name), imageTag);
        //return ContainerImage.fromRegistry(this.props.repositories.getByName(name).repositoryUri + ':' + imageTag);
    }
    getEcsSecrets(hasSecrets) {
        var _a;
        if (hasSecrets) {
            return this.getSecrets().getEcsSecrets((_a = this.props.secretKeys) !== null && _a !== void 0 ? _a : []);
        }
        return {};
    }
    getSecrets() {
        return this.props.secrets;
    }
    getEnvironment(hasEnvironment) {
        if (hasEnvironment && this.props.environment) {
            return this.props.environment;
        }
        return {};
    }
    getLogging(name, props) {
        const lgName = `${name}-log-group`;
        return aws_ecs_1.LogDriver.awsLogs({
            streamPrefix: props.image,
            logGroup: new aws_logs_1.LogGroup(this.scope, lgName, {
                logGroupName: lgName,
                removalPolicy: core_1.RemovalPolicy.DESTROY,
                retention: aws_logs_1.RetentionDays.ONE_MONTH
            })
        });
    }
}
exports.ContainerFactory = ContainerFactory;
//# sourceMappingURL=container-factory.js.map