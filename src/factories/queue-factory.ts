import {AbstractFactory} from "./abstract-factory";
import {Cluster, ContainerImage, FargatePlatformVersion, LogDriver, Secret} from "@aws-cdk/aws-ecs";
import {Construct, Duration, RemovalPolicy} from "@aws-cdk/core";
import {Command, EntryPoint} from "../definitions/commands";
import {QueueProcessingFargateService} from "@aws-cdk/aws-ecs-patterns";
import {QueueProps, QueueWrapper} from "../definitions/tasks-services";
import {Repositories, RepositoryType} from "./repositories";
import {Secrets} from "../secrets";
import {LogGroup, RetentionDays} from "@aws-cdk/aws-logs";
import {CommandFactory} from "./command-factory";

export interface QueueFactoryProps {
    readonly cluster: Cluster;
    readonly repositories: Repositories;
    readonly secretKeys?: string[];
    readonly environment?: { [key: string]: string };
    readonly secrets: Secrets;
    readonly commandFactory: CommandFactory;
}

export class QueueFactory extends AbstractFactory {
    readonly defaults: { [key: string]: any };
    readonly props: QueueFactoryProps;

    constructor(scope: Construct, id: string, props: QueueFactoryProps) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            assignPublicIp: false,
            platformVersion: FargatePlatformVersion.VERSION1_4,
            command: Command.QUEUE_WORK,
            minScalingCapacity: 1,
            maxScalingCapacity: 2
        }
    }

    create(props: QueueProps): QueueWrapper {
        const name = this.naming.next(`${this.id}-service-${props.type}`);
        const service = new QueueProcessingFargateService(this.scope, name, {
            image: this.getContainerImage(props.image),
            queue: props.queue,
            family: name,
            serviceName: name,
            cluster: this.props.cluster,
            platformVersion: props.platformVersion ?? this.defaults.platformVersion,
            assignPublicIp: this.defaults.assignPublicIp,
            command: this.getCommand(props),
            minScalingCapacity: props.minScalingCapacity ?? this.defaults.minScalingCapacity,
            maxScalingCapacity: props.maxScalingCapacity ?? this.defaults.maxScalingCapacity,
            cpu: props.cpu ?? undefined,
            memoryLimitMiB: props.memoryLimitMiB ?? undefined,
            secrets: this.getEcsSecrets(props.hasSecrets ?? false),
            environment: this.getEnvironment(props.hasEnv ?? false),
            logDriver: this.getLogging(name, props),
            retentionPeriod: props.retentionPeriodInDays ? Duration.days(props.retentionPeriodInDays) : undefined,
            maxReceiveCount: props.maxReceiveCount ?? undefined
        });
        return {
            type: props.type,
            taskDefinition: service.taskDefinition,
            wrapper: service,
        };
    }

    private getCommand(props: QueueProps): string[] {
        const cmd = this.props.commandFactory.create(EntryPoint.PHP, props.command ?? this.defaults.command);
        return [...cmd.entryPoint ?? [], ...cmd.command ?? []];
    }

    private getContainerImage(name: RepositoryType): ContainerImage {
        return this.props.repositories.getContainerImage(name);
    }

    private getEcsSecrets(hasSecrets: boolean): { [key: string]: Secret } {
        if (hasSecrets) {
            return this.getSecrets().getEcsSecrets(this.props.secretKeys ?? []);
        }
        return {};
    }

    private getSecrets(): Secrets {
        return this.props.secrets;
    }

    private getEnvironment(hasEnvironment: boolean): { [key: string]: string } {
        if (hasEnvironment && this.props.environment) {
            return this.props.environment;
        }
        return {};
    }

    private getLogging(name: string, props: QueueProps): LogDriver {
        const lgName = `${name}-log-group`;
        return LogDriver.awsLogs({
            streamPrefix: props.image,
            logGroup: new LogGroup(this.scope, lgName, {
                logGroupName: lgName,
                removalPolicy: RemovalPolicy.DESTROY,
                retention: RetentionDays.ONE_MONTH
            })
        });
    }
}
