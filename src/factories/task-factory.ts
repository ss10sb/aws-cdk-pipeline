import {Construct} from "@aws-cdk/core";
import {Cluster, FargatePlatformVersion, TaskDefinition} from "@aws-cdk/aws-ecs";
import {SchedulableTypes, TaskProps, TaskServiceType, TaskWrapper} from "../definitions/tasks-services";
import {AbstractFactory} from "./abstract-factory";
import {TaskDefinitionFactory} from "./task-definition-factory";
import {CronOptions, Schedule} from "@aws-cdk/aws-autoscaling";
import {RunTask, RunTaskProps} from "../run-task";
import {ScheduledFargateTask} from "@aws-cdk/aws-ecs-patterns";

export interface TaskFactoryProps {
    readonly cluster: Cluster;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}

export class TaskFactory extends AbstractFactory {
    readonly defaults: { [key: string]: any };
    readonly props: TaskFactoryProps;

    constructor(scope: Construct, id: string, props: TaskFactoryProps) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            platformVersion: FargatePlatformVersion.VERSION1_4
        }
    }

    create(tasks: TaskProps[]): TaskWrapper[] {
        let taskWrappers: TaskWrapper[] = [];
        for (const task of tasks) {
            const created = this.createFromTask(task);
            if (created) {
                taskWrappers.push(created);
            }
        }
        return taskWrappers;
    }

    getTaskDefinitionFactory(): TaskDefinitionFactory {
        return this.props.taskDefinitionFactory;
    }

    private createFromTask(task: TaskProps): TaskWrapper | null {
        const taskDefinition = this.getTaskDefinitionFactory().create(task.type, task.taskDefinition);
        let resource: ScheduledFargateTask | RunTask | undefined;
        if (task.type === TaskServiceType.SCHEDULED_TASK) {
            resource = this.createScheduledTask(task, taskDefinition);
        } else if (task.type === TaskServiceType.CREATE_RUN_ONCE_TASK) {
            resource = this.createRunOnceOnCreate(task, taskDefinition);

        } else if (task.type === TaskServiceType.UPDATE_RUN_ONCE_TASK) {
            resource = this.createRunOnceOnUpdate(task, taskDefinition);
        }
        return resource ? {
            type: task.type,
            taskDefinition: taskDefinition,
            wrapper: resource
        } : null;
    }

    private createRunOnceOnCreate(task: TaskProps, taskDefinition: TaskDefinition): RunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: false,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnceOnUpdate(task: TaskProps, taskDefinition: TaskDefinition): RunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: false,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnceOnCreateAndUpdate(task: TaskProps, taskDefinition: TaskDefinition): RunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnce(task: TaskProps, runTaskProps: RunTaskProps): RunTask {
        const name = this.getTaskName(task);
        return new RunTask(this.scope, name, runTaskProps);
    }

    private createScheduledTask(task: TaskProps, taskDefinition: TaskDefinition): ScheduledFargateTask {
        const name = this.getTaskName(task);
        return new ScheduledFargateTask(this.scope, name, {
            scheduledFargateTaskDefinitionOptions: {
                taskDefinition: taskDefinition
            },
            schedule: this.getSchedule(task),
            cluster: this.props.cluster,
            platformVersion: this.defaults.platformVersion,
            ruleName: name,
            enabled: task.enabled ?? true
        });
    }

    private getSchedule(task: TaskProps): Schedule {
        let schedule = Schedule.expression('rate(1 minute)');
        if (task.schedule) {
            if (task.schedule.type === SchedulableTypes.EXPRESSION) {
                schedule = Schedule.expression(<string>task.schedule.value);
            }
            if (task.schedule.type === SchedulableTypes.CRON) {
                schedule = Schedule.cron(<CronOptions>task.schedule.value);
            }
        }
        return schedule;
    }

    private getTaskName(task: TaskProps): string {
        return this.naming.next(this.mixNameWithId(`task-${task.type}`));
    }
}
