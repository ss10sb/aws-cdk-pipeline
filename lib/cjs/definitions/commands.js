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
    Command[Command["MIGRATE"] = 2] = "MIGRATE";
    Command[Command["MIGRATE_SEED"] = 3] = "MIGRATE_SEED";
    Command[Command["MIGRATE_REFRESH"] = 4] = "MIGRATE_REFRESH";
    Command[Command["SEED"] = 5] = "SEED";
    Command[Command["QUEUE_WORK"] = 6] = "QUEUE_WORK";
    Command[Command["QUEUE_ONE"] = 7] = "QUEUE_ONE";
    Command[Command["QUEUE_EXIT"] = 8] = "QUEUE_EXIT";
    Command[Command["ROLE_SET"] = 9] = "ROLE_SET";
    Command[Command["SCHEDULE_ONE"] = 10] = "SCHEDULE_ONE";
    Command[Command["SCHEDULE_WORK"] = 11] = "SCHEDULE_WORK";
    Command[Command["UNDEFINED"] = 12] = "UNDEFINED";
})(Command = exports.Command || (exports.Command = {}));
//# sourceMappingURL=commands.js.map