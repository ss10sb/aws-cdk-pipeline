import {Construct, PhysicalName} from "@aws-cdk/core";
import {Compatibility, NetworkMode, TaskDefinition} from "@aws-cdk/aws-ecs";
import {TaskDefinitionProps, TaskServiceType} from "../definitions/tasks-services";
import {Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {ContainerFactory} from "./container-factory";
import {AbstractFactory} from "./abstract-factory";

export interface TaskDefinitionFactoryProps {
    readonly containerFactory: ContainerFactory;
}


export class TaskDefinitionFactory extends AbstractFactory {
    readonly defaults: { [key: string]: any };
    readonly props: TaskDefinitionFactoryProps;

    constructor(scope: Construct, id: string, props: TaskDefinitionFactoryProps) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            compatibility: Compatibility.FARGATE,
            networkMode: NetworkMode.AWS_VPC
        }
    }

    create(type: TaskServiceType, props: TaskDefinitionProps): TaskDefinition {
        const name = this.naming.next(this.mixNameWithId(`task-def-${type}`));
        const td = new TaskDefinition(this.scope, name, {
            family: name,
            compatibility: props.compatibility ?? this.defaults.compatibility,
            cpu: props.cpu,
            memoryMiB: props.memoryMiB,
            networkMode: props.networkMode ?? this.defaults.networkMode,
            executionRole: new Role(this.scope, `${name}-exec-role`, {
                assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
                roleName: PhysicalName.GENERATE_IF_NEEDED
            })
        });
        this.getContainerFactory().create(type, td, props.containers);
        return td;
    }

    getContainerFactory(): ContainerFactory {
        return this.props.containerFactory;
    }
}
