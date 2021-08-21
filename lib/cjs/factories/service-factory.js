"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceFactory = void 0;
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const tasks_services_1 = require("../definitions/tasks-services");
const abstract_factory_1 = require("./abstract-factory");
class ServiceFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            assignPublicIp: false,
            platformVersion: aws_ecs_1.FargatePlatformVersion.VERSION1_4,
            desiredCount: 1
        };
    }
    create(services) {
        let created = [];
        for (const serviceProps of services) {
            created.push(this.createService(this.props.cluster, this.props.targetGroup, serviceProps));
        }
        return created;
    }
    getTaskDefinitionFactory() {
        return this.props.taskDefinitionFactory;
    }
    createService(cluster, targetGroup, serviceProps) {
        const name = this.naming.next(`${this.id}-service-${serviceProps.type}`);
        const taskDefinition = this.getTaskDefinitionFactory().create(serviceProps.type, serviceProps.taskDefinition);
        const service = this.createStandardService({
            name: name,
            cluster: cluster,
            taskDefinition: taskDefinition,
            targetGroup: targetGroup,
            serviceProps: serviceProps
        });
        return {
            type: serviceProps.type,
            taskDefinition: taskDefinition,
            wrapper: service
        };
    }
    createStandardService(props) {
        var _a, _b, _c, _d;
        const service = new aws_ecs_1.FargateService(this.scope, props.name, {
            cluster: props.cluster,
            serviceName: props.name,
            platformVersion: (_a = props.serviceProps.platformVersion) !== null && _a !== void 0 ? _a : this.defaults.platformVersion,
            taskDefinition: props.taskDefinition,
            desiredCount: (_b = props.serviceProps.desiredCount) !== null && _b !== void 0 ? _b : this.defaults.desiredCount,
            assignPublicIp: (_c = props.serviceProps.assignPublicIp) !== null && _c !== void 0 ? _c : this.defaults.assignPublicIp,
            enableExecuteCommand: (_d = props.serviceProps.enableExecuteCommand) !== null && _d !== void 0 ? _d : undefined
        });
        if (props.serviceProps.attachToTargetGroup) {
            service.attachToApplicationTargetGroup(props.targetGroup);
        }
        if (props.serviceProps.scalable) {
            this.scalableTarget(service, props.serviceProps.scalable);
        }
        return service;
    }
    scalableTarget(service, scalableProps) {
        const scalableTarget = service.autoScaleTaskCount({
            maxCapacity: scalableProps.maxCapacity,
            minCapacity: scalableProps.minCapacity
        });
        this.addScaling(scalableTarget, scalableProps);
        return scalableTarget;
    }
    addScaling(scalableTarget, scalableProps) {
        for (const type of scalableProps.types) {
            if (type === tasks_services_1.ScalableTypes.CPU) {
                scalableTarget.scaleOnCpuUtilization(this.mixNameWithId('service-scale-cpu'), {
                    targetUtilizationPercent: scalableProps.scaleAt
                });
            }
            if (type === tasks_services_1.ScalableTypes.MEMORY) {
                scalableTarget.scaleOnMemoryUtilization(this.mixNameWithId('service-scale-mem'), {
                    targetUtilizationPercent: scalableProps.scaleAt
                });
            }
        }
    }
}
exports.ServiceFactory = ServiceFactory;
//# sourceMappingURL=service-factory.js.map