import {AlbUtils, ConfigStack, ConfigStackProps, VpcUtils} from "@smorken/cdk-utils";
import {IVpc} from "@aws-cdk/aws-ec2";
import {Cluster, ICluster} from "@aws-cdk/aws-ecs";
import {ARecord} from "@aws-cdk/aws-route53";
import {Domain} from "./domain";
import {
    ApplicationListenerRule,
    IApplicationListener,
    IApplicationLoadBalancer,
    IApplicationTargetGroup
} from "@aws-cdk/aws-elasticloadbalancingv2";
import {Table} from "@aws-cdk/aws-dynamodb";
import {Dynamodb} from "./dynamodb";
import {Queue} from "@aws-cdk/aws-sqs";
import {Sqs} from "./sqs";
import {FargateFactory, FargateTasksServices} from "./factories/fargate-factory";
import {EnvConfig, EnvProps} from "./definitions/env-config";
import {Construct, Duration, StackProps, Tags} from "@aws-cdk/core";
import {AlbListenerRule} from "./alb/alb-listener-rule";
import {AlbTargetGroup} from "./alb/alb-target-group";
import {AlbLookup} from "./lookups/alb-lookup";
import {ListenerLookup} from "./lookups/listener-lookup";
import {ClusterFactory} from "./factories/cluster-factory";
import {Repositories} from "./factories/repositories";
import {Secrets} from "./secrets";
import {VerifySesDomain} from "./ses/verify-ses-domain";
import {Ses} from "./ses/ses";
import {EnvStackPermissions} from "./permissions/env-stack-permissions";
import {Bucket} from "@aws-cdk/aws-s3";
import {S3} from "./s3";
import {StartStop} from "./start-stop/start-stop";

interface TasksAndServicesProps {
    readonly targetGroup: IApplicationTargetGroup;
    readonly repositories: Repositories;
    readonly environment?: { [key: string]: string };
    readonly queue?: Queue;
}

interface EnvironmentProps {
    readonly table?: Table;
    readonly queue?: Queue;
    readonly s3?: Bucket;
}

interface PermissionsProps {
    readonly tasksServices: FargateTasksServices;
    readonly table?: Table;
    readonly repositories: Repositories;
    readonly queue?: Queue;
    readonly s3?: Bucket;
}

export class EnvStack<T extends EnvConfig> extends ConfigStack<T> {

    alb!: IApplicationLoadBalancer;
    envProps: EnvProps;
    listener!: IApplicationListener;
    vpc!: IVpc;

    constructor(scope: Construct, id: string, stackProps: StackProps, config: T, envProps: EnvProps, configStackProps?: ConfigStackProps) {
        super(scope, id, stackProps, config, configStackProps);
        this.envProps = envProps;
        this.handleLookups();
        Tags.of(scope).add('College', config.College);
        Tags.of(scope).add('Environment', config.Environment);
        Tags.of(scope).add('App', config.Name);
    }

    exec() {
        const aRecord = this.createARecord();
        const sesVerify = this.createSesVerifyDomain();
        const targetGroup = this.createTargetGroup();
        const listenerRule = this.createListenerRule(targetGroup);
        const table = this.createDynamoDbTable();
        const queue = this.createQueues();
        const s3 = this.createS3Bucket();
        const cluster = this.createCluster();
        const tasksAndServices = this.createTasksAndServices(cluster, {
            targetGroup: targetGroup,
            repositories: this.envProps.repositories,
            environment: this.getEnvironmentForContainers({
                table: table ?? undefined,
                queue: queue ?? undefined,
                s3: s3 ?? undefined
            })
        });
        const startStop = this.createStartStopHandler(cluster);
        new EnvStackPermissions(this, this.getName('permissions'), {
            cluster: cluster,
            tasksServices: tasksAndServices,
            table: table ?? undefined,
            repositories: this.envProps.repositories,
            queue: queue ?? undefined,
            s3: s3 ?? undefined,
            startStop: startStop ?? undefined,
        })
    }

    private createARecord(): ARecord | null {
        const domain = new Domain(this, this.getName('domain'), this.alb, this.config.Parameters.hostedZoneDomain);
        return domain.createARecord(this.config.Parameters.subdomain);
    }

    private createSesVerifyDomain(): VerifySesDomain | null {
        if (this.config.Parameters.hostedZoneDomain && this.config.Parameters.subdomain) {
            const ses = new Ses(this, this.node.id);
            return ses.verifyDomain({
                subdomain: this.config.Parameters.subdomain,
                hostedZone: this.config.Parameters.hostedZoneDomain
            });
        }
        return null;
    }

    private createStartStopHandler(cluster: ICluster): StartStop | undefined {
        if (this.config.Parameters.startStop) {
            this.config.Parameters.startStop.startStopFunctionProps = this.config.Parameters.startStop.startStopFunctionProps ?? {};
            this.config.Parameters.startStop.startStopFunctionProps.cluster = cluster;
            const ss: StartStop = new StartStop(this, this.node.id, this.config.Parameters.startStop);
            ss.createRules(cluster);
            return ss;
        }
    }

    private createCluster(): Cluster {
        const clusterFactory = new ClusterFactory(this, this.node.id, {
            vpc: this.vpc,
            alarmEmails: this.config.Parameters.alarmEmails ?? [],
            containerInsights: this.config.Parameters.containerInsights ?? false,
        });
        return clusterFactory.create();
    }

    private createQueues(): Queue | undefined {
        if (this.config.Parameters.queue) {
            let dlq: Queue | undefined = undefined;
            if (this.config.Parameters.queue.hasDeadLetterQueue ?? false) {
                dlq = this.createDeadLetterQueue();
            }
            return this.createDefaultQueue(dlq);
        }
    }

    private createDeadLetterQueue(): Queue {
        const sqs = new Sqs(this, this.node.id);
        const duration = Duration.days(this.config.Parameters.queue?.retentionPeriodInDays ?? 3);
        return sqs.create({
            queueName: 'dlq',
            retentionPeriod: duration,
        });
    }

    private createDefaultQueue(deadLetterQueue?: Queue): Queue | undefined {
        const sqs = new Sqs(this, this.node.id);
        let props: { [key: string]: any } = {};
        if (deadLetterQueue) {
            props['deadLetterQueue'] = {
                queue: deadLetterQueue,
                maxReceiveCount: this.config.Parameters.queue?.maxReceiveCount ?? 3
            }
        }
        const queue = sqs.create(props);
        // @ts-ignore
        this.config.Parameters.queue.queue = queue;
        return queue;
    }

    private createDynamoDbTable(name: string = 'cache'): Table | null {
        if (this.config.Parameters.dynamoDb) {
            const dyn = new Dynamodb(this, this.node.id);
            return dyn.create(name, this.config.Parameters.dynamoDb);
        }
        return null;
    }

    private createS3Bucket(name: string = 's3'): Bucket | null {
        if (this.config.Parameters.s3) {
            const s3 = new S3(this, this.node.id);
            return s3.create(name, this.config.Parameters.s3);
        }
        return null;
    }

    private createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule {
        const lr = new AlbListenerRule(this, this.getName('listener-rule'), this.listener, this.config.Parameters.listenerRule);
        return lr.createListenerRule(targetGroup);
    }

    private createTasksAndServices(cluster: ICluster, props: TasksAndServicesProps): FargateTasksServices {
        const secrets = new Secrets(this, this.node.id);
        const factory = new FargateFactory(this, this.node.id, {
            commandFactoryProps: {},
            containerFactoryProps: {
                repositories: props.repositories,
                secretKeys: this.config.Parameters.secretKeys,
                environment: props.environment,
                secrets: secrets
            },
            queueFactoryProps: {
                cluster: cluster,
                repositories: props.repositories,
                secretKeys: this.config.Parameters.secretKeys,
                environment: props.environment,
                secrets: secrets
            },
            serviceFactoryProps: {
                cluster: cluster,
                targetGroup: props.targetGroup
            },
            taskDefinitionFactoryProps: {},
            taskFactoryProps: {
                cluster: cluster,
                skipCreateTask: this.config.Parameters.canCreateTask ?? true
            }
        });
        return factory.create(this.config.Parameters.tasks ?? [], this.config.Parameters.services ?? [], this.config.Parameters.queue);
    }

    private createTargetGroup(): IApplicationTargetGroup {
        const tg = new AlbTargetGroup(this, this.getName('tg'), this.vpc, this.config);
        return tg.createApplicationTargetGroup();
    }

    private getEnvironmentForContainers(envProps: EnvironmentProps): { [key: string]: string } {
        let props: { [key: string]: string } = {};
        if (this.config.Parameters.subdomain && this.config.Parameters.hostedZoneDomain) {
            const mailFromDomain = `${this.config.Parameters.subdomain}.${this.config.Parameters.hostedZoneDomain}`;
            props['MAIL_FROM_ADDRESS'] = `no-reply@${mailFromDomain}`;
            props['IMPORTER_FROM'] = `importer-no-reply@${mailFromDomain}`;
        }
        if (envProps.table) {
            props['DYNAMODB_CACHE_TABLE'] = envProps.table.tableName
        }
        if (envProps.queue) {
            props['SQS_QUEUE'] = envProps.queue.queueUrl;
        }
        if (envProps.s3) {
            props['AWS_BUCKET'] = envProps.s3.bucketName;
        }
        props['CAN_RUN_CREATE'] = this.config.Parameters.canCreateTask === false ? '0' : '1';
        return props;
    }

    private getName(suffix: string): string {
        return `${this.node.id}-${suffix}`;
    }

    private handleLookups(): void {
        const albArn = AlbLookup.getAlbArn(this, this.config);
        this.listener = ListenerLookup.getApplicationListener(this, this.config, albArn);
        this.alb = AlbLookup.getAlb(this, this.config, albArn);
        this.vpc = VpcUtils.getVpcFromConfig(this, this.config);
    }
}
