import {TaskDefinitionFactory} from "./task-definition-factory";
import {Construct} from "@aws-cdk/core";
import {
    BaseService,
    Cluster,
    FargatePlatformVersion,
    FargateService,
    ScalableTaskCount,
    TaskDefinition
} from "@aws-cdk/aws-ecs";
import {ScalableProps, ScalableTypes, ServiceProps, ServiceWrapper} from "../definitions/tasks-services";
import {IApplicationTargetGroup} from "@aws-cdk/aws-elasticloadbalancingv2";
import {AbstractFactory} from "./abstract-factory";

interface BaseServiceProps {
    readonly name: string;
    readonly cluster: Cluster;
    readonly taskDefinition: TaskDefinition;
    readonly serviceProps: ServiceProps;
}

interface StandardServiceProps extends BaseServiceProps {
    readonly targetGroup: IApplicationTargetGroup;
}

export interface ServiceFactoryProps {
    readonly cluster: Cluster;
    readonly targetGroup: IApplicationTargetGroup;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}

export class ServiceFactory extends AbstractFactory {
    readonly defaults: { [key: string]: any };
    readonly props: ServiceFactoryProps;

    constructor(scope: Construct, id: string, props: ServiceFactoryProps) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            assignPublicIp: false,
            platformVersion: FargatePlatformVersion.VERSION1_4,
            desiredCount: 1
        }
    }

    create(services: ServiceProps[]): ServiceWrapper[] {
        let created: ServiceWrapper[] = [];
        for (const serviceProps of services) {
            created.push(this.createService(this.props.cluster, this.props.targetGroup, serviceProps));
        }
        return created;
    }

    getTaskDefinitionFactory(): TaskDefinitionFactory {
        return this.props.taskDefinitionFactory;
    }

    private createService(cluster: Cluster, targetGroup: IApplicationTargetGroup, serviceProps: ServiceProps): ServiceWrapper {
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

    private createStandardService(props: StandardServiceProps): BaseService {
        const service = new FargateService(this.scope, props.name, {
            cluster: props.cluster,
            serviceName: props.name,
            platformVersion: props.serviceProps.platformVersion ?? this.defaults.platformVersion,
            taskDefinition: props.taskDefinition,
            desiredCount: props.serviceProps.desiredCount ?? this.defaults.desiredCount,
            assignPublicIp: props.serviceProps.assignPublicIp ?? this.defaults.assignPublicIp,
            enableExecuteCommand: props.serviceProps.enableExecuteCommand ?? undefined
        });
        if (props.serviceProps.attachToTargetGroup) {
            service.attachToApplicationTargetGroup(props.targetGroup);
        }
        if (props.serviceProps.scalable) {
            this.scalableTarget(service, props.serviceProps.scalable);
        }
        return service;
    }

    private scalableTarget(service: BaseService, scalableProps: ScalableProps): ScalableTaskCount {
        const scalableTarget = service.autoScaleTaskCount({
            maxCapacity: scalableProps.maxCapacity,
            minCapacity: scalableProps.minCapacity
        });
        this.addScaling(scalableTarget, scalableProps);
        return scalableTarget;
    }

    private addScaling(scalableTarget: ScalableTaskCount, scalableProps: ScalableProps): void {
        for (const type of scalableProps.types) {
            if (type === ScalableTypes.CPU) {
                scalableTarget.scaleOnCpuUtilization(this.mixNameWithId('service-scale-cpu'), {
                    targetUtilizationPercent: scalableProps.scaleAt
                });
            }
            if (type === ScalableTypes.MEMORY) {
                scalableTarget.scaleOnMemoryUtilization(this.mixNameWithId('service-scale-mem'), {
                    targetUtilizationPercent: scalableProps.scaleAt
                });
            }
        }
    }
}
