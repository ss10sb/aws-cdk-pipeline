import { AbstractFactory } from "./abstract-factory";
import { Cluster } from "@aws-cdk/aws-ecs";
import { Construct } from "@aws-cdk/core";
import { QueueProps, QueueWrapper } from "../definitions/tasks-services";
import { Repositories } from "./repositories";
import { Secrets } from "../secrets";
import { CommandFactory } from "./command-factory";
export interface QueueFactoryProps {
    readonly cluster: Cluster;
    readonly repositories: Repositories;
    readonly secretKeys?: string[];
    readonly environment?: {
        [key: string]: string;
    };
    readonly secrets: Secrets;
    readonly commandFactory: CommandFactory;
}
export declare class QueueFactory extends AbstractFactory {
    readonly defaults: {
        [key: string]: any;
    };
    readonly props: QueueFactoryProps;
    constructor(scope: Construct, id: string, props: QueueFactoryProps);
    create(props: QueueProps): QueueWrapper;
    private getCommand;
    private getContainerImage;
    private getEcsSecrets;
    private getSecrets;
    private getEnvironment;
    private getLogging;
}
