import {BaseService, Compatibility, FargatePlatformVersion, NetworkMode, TaskDefinition} from "@aws-cdk/aws-ecs";
import {ContainerProps} from "./containers";
import {CronOptions} from "@aws-cdk/aws-autoscaling";
import {QueueProcessingFargateService, ScheduledFargateTask} from "@aws-cdk/aws-ecs-patterns";
import {RunTask} from "../run-task";
import {RepositoryType} from "../factories/repositories";
import {Command} from "./commands";
import {Queue} from "@aws-cdk/aws-sqs";

export enum TaskServiceType {
    WEB_SERVICE = 'web',
    TASK = 'task',
    SCHEDULED_TASK = 'scheduledtask',
    RUN_ONCE_TASK = 'runtask',
    CREATE_RUN_ONCE_TASK = 'createruntask',
    UPDATE_RUN_ONCE_TASK = 'updateruntask',
    QUEUE_SERVICE = 'queue'
}

export enum ScalableTypes {
    CPU = 'cpu',
    MEMORY = 'mem'
}

export interface ScalableProps {
    readonly types: ScalableTypes[];
    readonly scaleAt: number;
    readonly minCapacity: number;
    readonly maxCapacity: number;
}

export enum SchedulableTypes {
    CRON,
    EXPRESSION
}

export interface Schedulable {
    readonly type: SchedulableTypes;
    readonly value: string | CronOptions;
}

export interface BaseServiceTaskProps {
    readonly type: TaskServiceType;
    readonly platformVersion?: FargatePlatformVersion;
    readonly enableExecuteCommand?: boolean;
}

export interface QueueProps extends BaseServiceTaskProps {
    readonly image: RepositoryType;
    readonly command?: Command;
    readonly cpu: number;
    readonly hasSecrets?: boolean;
    readonly hasEnv?: boolean;
    readonly hasDeadLetterQueue?: boolean;
    readonly retentionPeriodInDays?: number;
    readonly maxReceiveCount?: number;
    readonly memoryLimitMiB?: number;
    readonly minScalingCapacity?: number;
    readonly maxScalingCapacity?: number;
    queue?: Queue;
}

export interface ServiceTaskProps extends BaseServiceTaskProps {
    readonly desiredCount?: number;
    readonly taskDefinition: TaskDefinitionProps;
}

export interface ServiceProps extends ServiceTaskProps {
    readonly assignPublicIp?: boolean;
    readonly scalable?: ScalableProps;
    readonly attachToTargetGroup: boolean;
}

export interface TaskProps extends ServiceTaskProps {
    readonly skipCreateTask?: boolean;
    readonly schedule?: Schedulable;
    readonly enabled?: boolean;
}

export interface TaskDefinitionProps {
    readonly compatibility?: Compatibility;
    readonly networkMode?: NetworkMode;
    readonly cpu: string;
    readonly memoryMiB: string;
    readonly containers: ContainerProps[];
}

export interface Wrapper {
    readonly taskDefinition: TaskDefinition;
    readonly type: TaskServiceType;
}

export interface ServiceWrapper extends Wrapper {
    readonly wrapper: BaseService;
}

export interface TaskWrapper extends Wrapper {
    readonly wrapper: ScheduledFargateTask | RunTask;
}

export interface QueueWrapper extends Wrapper {
    readonly wrapper: QueueProcessingFargateService;
}
