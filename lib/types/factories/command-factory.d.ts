import { Command, ContainerCommand, EntryPoint } from "../definitions/commands";
import { AbstractFactory } from "./abstract-factory";
import { Construct } from "@aws-cdk/core";
export interface CommandFactoryProps {
}
export declare class CommandFactory extends AbstractFactory {
    readonly entryPoints: {
        [key in EntryPoint]: string[] | undefined;
    };
    readonly commands: {
        [key in Command]: string[];
    };
    readonly props: CommandFactoryProps;
    constructor(scope: Construct, id: string, props: CommandFactoryProps);
    create(entryPoint: EntryPoint, command: Command, additional?: string[]): ContainerCommand;
    createCommand(command: Command, entryPoint: EntryPoint, additional?: string[]): string[];
    private getEntryPoint;
    private getCommandArray;
}
