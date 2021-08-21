"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskFactory = void 0;
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const tasks_services_1 = require("../definitions/tasks-services");
const abstract_factory_1 = require("./abstract-factory");
const aws_autoscaling_1 = require("@aws-cdk/aws-autoscaling");
const run_task_1 = require("../run-task");
const aws_ecs_patterns_1 = require("@aws-cdk/aws-ecs-patterns");
class TaskFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            platformVersion: aws_ecs_1.FargatePlatformVersion.VERSION1_4
        };
    }
    create(tasks) {
        let taskWrappers = [];
        for (const task of tasks) {
            const created = this.createFromTask(task);
            if (created) {
                taskWrappers.push(created);
            }
        }
        return taskWrappers;
    }
    getTaskDefinitionFactory() {
        return this.props.taskDefinitionFactory;
    }
    createFromTask(task) {
        const taskDefinition = this.getTaskDefinitionFactory().create(task.type, task.taskDefinition);
        let resource;
        if (task.type === tasks_services_1.TaskServiceType.SCHEDULED_TASK) {
            resource = this.createScheduledTask(task, taskDefinition);
        }
        else if (task.type === tasks_services_1.TaskServiceType.CREATE_RUN_ONCE_TASK) {
            resource = this.createRunOnceOnCreate(task, taskDefinition);
        }
        else if (task.type === tasks_services_1.TaskServiceType.UPDATE_RUN_ONCE_TASK) {
            resource = this.createRunOnceOnUpdate(task, taskDefinition);
        }
        return resource ? {
            type: task.type,
            taskDefinition: taskDefinition,
            wrapper: resource
        } : null;
    }
    createRunOnceOnCreate(task, taskDefinition) {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: false,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }
    createRunOnceOnUpdate(task, taskDefinition) {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: false,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }
    createRunOnceOnCreateAndUpdate(task, taskDefinition) {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }
    createRunOnce(task, runTaskProps) {
        const name = this.getTaskName(task);
        return new run_task_1.RunTask(this.scope, name, runTaskProps);
    }
    createScheduledTask(task, taskDefinition) {
        var _a;
        const name = this.getTaskName(task);
        return new aws_ecs_patterns_1.ScheduledFargateTask(this.scope, name, {
            scheduledFargateTaskDefinitionOptions: {
                taskDefinition: taskDefinition
            },
            schedule: this.getSchedule(task),
            cluster: this.props.cluster,
            platformVersion: this.defaults.platformVersion,
            ruleName: name,
            enabled: (_a = task.enabled) !== null && _a !== void 0 ? _a : true
        });
    }
    getSchedule(task) {
        let schedule = aws_autoscaling_1.Schedule.expression('rate(1 minute)');
        if (task.schedule) {
            if (task.schedule.type === tasks_services_1.SchedulableTypes.EXPRESSION) {
                schedule = aws_autoscaling_1.Schedule.expression(task.schedule.value);
            }
            if (task.schedule.type === tasks_services_1.SchedulableTypes.CRON) {
                schedule = aws_autoscaling_1.Schedule.cron(task.schedule.value);
            }
        }
        return schedule;
    }
    getTaskName(task) {
        return this.naming.next(this.mixNameWithId(`task-${task.type}`));
    }
}
exports.TaskFactory = TaskFactory;
//# sourceMappingURL=task-factory.js.map