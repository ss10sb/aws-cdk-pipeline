"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.EntryPoint = void 0;
var EntryPoint;
(function (EntryPoint) {
    EntryPoint[EntryPoint["PHP"] = 0] = "PHP";
    EntryPoint[EntryPoint["SH"] = 1] = "SH";
    EntryPoint[EntryPoint["BASH"] = 2] = "BASH";
    EntryPoint[EntryPoint["UNDEFINED"] = 3] = "UNDEFINED";
})(EntryPoint = exports.EntryPoint || (exports.EntryPoint = {}));
var Command;
(function (Command) {
    Command[Command["ARTISAN"] = 0] = "ARTISAN";
    Command[Command["ON_CREATE"] = 1] = "ON_CREATE";
    Command[Command["ON_UPDATE"] = 2] = "ON_UPDATE";
    Command[Command["MIGRATE"] = 3] = "MIGRATE";
    Command[Command["MIGRATE_SEED"] = 4] = "MIGRATE_SEED";
    Command[Command["MIGRATE_REFRESH"] = 5] = "MIGRATE_REFRESH";
    Command[Command["SEED"] = 6] = "SEED";
    Command[Command["QUEUE_WORK"] = 7] = "QUEUE_WORK";
    Command[Command["QUEUE_ONE"] = 8] = "QUEUE_ONE";
    Command[Command["QUEUE_EXIT"] = 9] = "QUEUE_EXIT";
    Command[Command["ROLE_SET"] = 10] = "ROLE_SET";
    Command[Command["SCHEDULE_ONE"] = 11] = "SCHEDULE_ONE";
    Command[Command["SCHEDULE_WORK"] = 12] = "SCHEDULE_WORK";
    Command[Command["UNDEFINED"] = 13] = "UNDEFINED";
})(Command = exports.Command || (exports.Command = {}));
//# sourceMappingURL=commands.js.map