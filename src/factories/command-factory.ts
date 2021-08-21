import {Command, ContainerCommand, EntryPoint} from "../definitions/commands";
import {AbstractFactory} from "./abstract-factory";
import {Construct} from "@aws-cdk/core";

export interface CommandFactoryProps {

}

export class CommandFactory extends AbstractFactory {
    readonly entryPoints: { [key in EntryPoint]: string[] | undefined };
    readonly commands: { [key in Command]: string[] };
    readonly props: CommandFactoryProps;

    constructor(scope: Construct, id: string, props: CommandFactoryProps) {
        super(scope, id);
        this.props = props;
        this.entryPoints = {
            [EntryPoint.PHP]: ['/usr/local/bin/php'],
            [EntryPoint.SH]: ['/bin/sh', '-c'],
            [EntryPoint.BASH]: ['/bin/bash', '-c'],
            [EntryPoint.UNDEFINED]: undefined,
        };
        this.commands = {
            [Command.ARTISAN]: [
                'artisan'
            ],
            [Command.ON_CREATE]: [
                '/on_create.sh'
            ],
            [Command.MIGRATE]: [
                'artisan',
                'migrate',
                '--force'
            ],
            [Command.MIGRATE_SEED]: [
                'artisan',
                'migrate',
                '--seed',
                '--force'
            ],
            [Command.MIGRATE_REFRESH]: [
                'artisan',
                'migrate:refresh',
                '--force'
            ],
            [Command.SEED]: [
                'artisan',
                'db:seed',
                '--force'],
            [Command.QUEUE_WORK]: [
                'artisan',
                'queue:work',
                '--tries=3',
                '--delay=3',
                '--sleep=3'
            ],
            [Command.QUEUE_ONE]: [
                'artisan',
                'queue:work',
                '--once',
                '--tries=3',
                '--delay=3',
            ],
            [Command.QUEUE_EXIT]: [
                'artisan',
                'queue:work',
                '--stop-when-empty',
                '--tries=3',
                '--delay=3',
            ],
            [Command.SCHEDULE_ONE]: [
                'artisan',
                'schedule:run'
            ],
            [Command.SCHEDULE_WORK]: [
                'artisan',
                'schedule:work'
            ],
            [Command.ROLE_SET]: [
                'artisan',
                'role:set'
            ],
            [Command.UNDEFINED]: [],
        }
    }

    create(entryPoint: EntryPoint, command: Command, additional: string[] = []): ContainerCommand {
        return {
            entryPoint: this.getEntryPoint(entryPoint),
            command: this.createCommand(command, entryPoint, additional)
        }
    }

    createCommand(command: Command, entryPoint: EntryPoint, additional: string[] = []): string[] {
        let cmds: string[] = [];
        cmds.push(...this.getCommandArray(command, additional));
        return cmds;
    }

    private getEntryPoint(entryPoint: EntryPoint): string[] | undefined {
        return this.entryPoints[entryPoint];
    }

    private getCommandArray(command: Command, additional: string[] = []): string[] {
        let cmds: string[] = [];
        cmds.push(...this.commands[command]);
        if (additional.length > 0) {
            cmds.push(...additional);
        }
        return cmds;
    }
}
