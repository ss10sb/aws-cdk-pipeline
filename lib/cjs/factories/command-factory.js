"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFactory = void 0;
const commands_1 = require("../definitions/commands");
const abstract_factory_1 = require("./abstract-factory");
class CommandFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.entryPoints = {
            [commands_1.EntryPoint.PHP]: ['/usr/local/bin/php'],
            [commands_1.EntryPoint.SH]: ['/bin/sh', '-c'],
            [commands_1.EntryPoint.BASH]: ['/bin/bash', '-c'],
            [commands_1.EntryPoint.UNDEFINED]: undefined,
        };
        this.commands = {
            [commands_1.Command.ARTISAN]: [
                'artisan'
            ],
            [commands_1.Command.ON_CREATE]: [
                '/on_create.sh'
            ],
            [commands_1.Command.MIGRATE]: [
                'artisan',
                'migrate',
                '--force'
            ],
            [commands_1.Command.MIGRATE_SEED]: [
                'artisan',
                'migrate',
                '--seed',
                '--force'
            ],
            [commands_1.Command.MIGRATE_REFRESH]: [
                'artisan',
                'migrate:refresh',
                '--force'
            ],
            [commands_1.Command.SEED]: [
                'artisan',
                'db:seed',
                '--force'
            ],
            [commands_1.Command.QUEUE_WORK]: [
                'artisan',
                'queue:work',
                '--tries=3',
                '--delay=3',
                '--sleep=3'
            ],
            [commands_1.Command.QUEUE_ONE]: [
                'artisan',
                'queue:work',
                '--once',
                '--tries=3',
                '--delay=3',
            ],
            [commands_1.Command.QUEUE_EXIT]: [
                'artisan',
                'queue:work',
                '--stop-when-empty',
                '--tries=3',
                '--delay=3',
            ],
            [commands_1.Command.SCHEDULE_ONE]: [
                'artisan',
                'schedule:run'
            ],
            [commands_1.Command.SCHEDULE_WORK]: [
                'artisan',
                'schedule:work'
            ],
            [commands_1.Command.ROLE_SET]: [
                'artisan',
                'role:set'
            ],
            [commands_1.Command.UNDEFINED]: [],
        };
    }
    create(entryPoint, command, additional = []) {
        return {
            entryPoint: this.getEntryPoint(entryPoint),
            command: this.createCommand(command, entryPoint, additional)
        };
    }
    createCommand(command, entryPoint, additional = []) {
        let cmds = [];
        cmds.push(...this.getCommandArray(command, additional));
        return cmds;
    }
    getEntryPoint(entryPoint) {
        return this.entryPoints[entryPoint];
    }
    getCommandArray(command, additional = []) {
        let cmds = [];
        cmds.push(...this.commands[command]);
        if (additional.length > 0) {
            cmds.push(...additional);
        }
        return cmds;
    }
}
exports.CommandFactory = CommandFactory;
//# sourceMappingURL=command-factory.js.map