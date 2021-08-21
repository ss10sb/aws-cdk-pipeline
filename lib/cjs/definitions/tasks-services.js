"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulableTypes = exports.ScalableTypes = exports.TaskServiceType = void 0;
var TaskServiceType;
(function (TaskServiceType) {
    TaskServiceType["WEB_SERVICE"] = "web";
    TaskServiceType["TASK"] = "task";
    TaskServiceType["SCHEDULED_TASK"] = "scheduledtask";
    TaskServiceType["RUN_ONCE_TASK"] = "runtask";
    TaskServiceType["CREATE_RUN_ONCE_TASK"] = "createruntask";
    TaskServiceType["UPDATE_RUN_ONCE_TASK"] = "updateruntask";
    TaskServiceType["QUEUE_SERVICE"] = "queue";
})(TaskServiceType = exports.TaskServiceType || (exports.TaskServiceType = {}));
var ScalableTypes;
(function (ScalableTypes) {
    ScalableTypes["CPU"] = "cpu";
    ScalableTypes["MEMORY"] = "mem";
})(ScalableTypes = exports.ScalableTypes || (exports.ScalableTypes = {}));
var SchedulableTypes;
(function (SchedulableTypes) {
    SchedulableTypes[SchedulableTypes["CRON"] = 0] = "CRON";
    SchedulableTypes[SchedulableTypes["EXPRESSION"] = 1] = "EXPRESSION";
})(SchedulableTypes = exports.SchedulableTypes || (exports.SchedulableTypes = {}));
//# sourceMappingURL=tasks-services.js.map