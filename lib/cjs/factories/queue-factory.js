"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueFactory = void 0;
const abstract_factory_1 = require("./abstract-factory");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const core_1 = require("@aws-cdk/core");
const commands_1 = require("../definitions/commands");
const aws_ecs_patterns_1 = require("@aws-cdk/aws-ecs-patterns");
const aws_logs_1 = require("@aws-cdk/aws-logs");
class QueueFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            assignPublicIp: false,
            platformVersion: aws_ecs_1.FargatePlatformVersion.VERSION1_4,
            command: commands_1.Command.QUEUE_WORK,
            minScalingCapacity: 1,
            maxScalingCapacity: 2
        };
    }
    create(props) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const name = this.naming.next(`${this.id}-service-${props.type}`);
        const service = new aws_ecs_patterns_1.QueueProcessingFargateService(this.scope, name, {
            image: this.getContainerImage(props.image),
            queue: props.queue,
            family: name,
            serviceName: name,
            cluster: this.props.cluster,
            platformVersion: (_a = props.platformVersion) !== null && _a !== void 0 ? _a : this.defaults.platformVersion,
            assignPublicIp: this.defaults.assignPublicIp,
            command: this.getCommand(props),
            minScalingCapacity: (_b = props.minScalingCapacity) !== null && _b !== void 0 ? _b : this.defaults.minScalingCapacity,
            maxScalingCapacity: (_c = props.maxScalingCapacity) !== null && _c !== void 0 ? _c : this.defaults.maxScalingCapacity,
            cpu: (_d = props.cpu) !== null && _d !== void 0 ? _d : undefined,
            memoryLimitMiB: (_e = props.memoryLimitMiB) !== null && _e !== void 0 ? _e : undefined,
            secrets: this.getEcsSecrets((_f = props.hasSecrets) !== null && _f !== void 0 ? _f : false),
            environment: this.getEnvironment((_g = props.hasEnv) !== null && _g !== void 0 ? _g : false),
            logDriver: this.getLogging(name, props),
            retentionPeriod: props.retentionPeriodInDays ? core_1.Duration.days(props.retentionPeriodInDays) : undefined,
            maxReceiveCount: (_h = props.maxReceiveCount) !== null && _h !== void 0 ? _h : undefined
        });
        return {
            type: props.type,
            taskDefinition: service.taskDefinition,
            wrapper: service,
        };
    }
    getCommand(props) {
        var _a, _b, _c;
        const cmd = this.props.commandFactory.create(commands_1.EntryPoint.PHP, (_a = props.command) !== null && _a !== void 0 ? _a : this.defaults.command);
        return [...(_b = cmd.entryPoint) !== null && _b !== void 0 ? _b : [], ...(_c = cmd.command) !== null && _c !== void 0 ? _c : []];
    }
    getContainerImage(name) {
        return this.props.repositories.getContainerImage(name);
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
exports.QueueFactory = QueueFactory;
//# sourceMappingURL=queue-factory.js.map