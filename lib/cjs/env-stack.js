"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvStack = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const domain_1 = require("./domain");
const dynamodb_1 = require("./dynamodb");
const sqs_1 = require("./sqs");
const fargate_factory_1 = require("./factories/fargate-factory");
const core_1 = require("@aws-cdk/core");
const alb_listener_rule_1 = require("./alb/alb-listener-rule");
const alb_target_group_1 = require("./alb/alb-target-group");
const alb_lookup_1 = require("./lookups/alb-lookup");
const listener_lookup_1 = require("./lookups/listener-lookup");
const cluster_factory_1 = require("./factories/cluster-factory");
const secrets_1 = require("./secrets");
const ses_1 = require("./ses/ses");
const env_stack_permissions_1 = require("./permissions/env-stack-permissions");
const s3_1 = require("./s3");
const start_stop_1 = require("./start-stop/start-stop");
class EnvStack extends cdk_utils_1.ConfigStack {
    constructor(scope, id, stackProps, config, envProps, configStackProps) {
        super(scope, id, stackProps, config, configStackProps);
        this.envProps = envProps;
        this.handleLookups();
        core_1.Tags.of(scope).add('College', config.College);
        core_1.Tags.of(scope).add('Environment', config.Environment);
        core_1.Tags.of(scope).add('App', config.Name);
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
                table: table !== null && table !== void 0 ? table : undefined,
                queue: queue !== null && queue !== void 0 ? queue : undefined,
                s3: s3 !== null && s3 !== void 0 ? s3 : undefined
            })
        });
        const startStop = this.createStartStopHandler(cluster);
        new env_stack_permissions_1.EnvStackPermissions(this, this.getName('permissions'), {
            cluster: cluster,
            tasksServices: tasksAndServices,
            table: table !== null && table !== void 0 ? table : undefined,
            repositories: this.envProps.repositories,
            queue: queue !== null && queue !== void 0 ? queue : undefined,
            s3: s3 !== null && s3 !== void 0 ? s3 : undefined,
            startStop: startStop !== null && startStop !== void 0 ? startStop : undefined,
        });
    }
    createARecord() {
        const domain = new domain_1.Domain(this, this.getName('domain'), this.alb, this.config.Parameters.hostedZoneDomain);
        return domain.createARecord(this.config.Parameters.subdomain);
    }
    createSesVerifyDomain() {
        if (this.config.Parameters.hostedZoneDomain && this.config.Parameters.subdomain) {
            const ses = new ses_1.Ses(this, this.node.id);
            return ses.verifyDomain({
                subdomain: this.config.Parameters.subdomain,
                hostedZone: this.config.Parameters.hostedZoneDomain
            });
        }
        return null;
    }
    createStartStopHandler(cluster) {
        var _a;
        if (this.config.Parameters.startStop) {
            this.config.Parameters.startStop.startStopFunctionProps = (_a = this.config.Parameters.startStop.startStopFunctionProps) !== null && _a !== void 0 ? _a : {};
            this.config.Parameters.startStop.startStopFunctionProps.cluster = cluster;
            const ss = new start_stop_1.StartStop(this, this.node.id, this.config.Parameters.startStop);
            ss.createRules(cluster);
            return ss;
        }
    }
    createCluster() {
        var _a;
        const clusterFactory = new cluster_factory_1.ClusterFactory(this, this.node.id, {
            vpc: this.vpc,
            alarmEmails: (_a = this.config.Parameters.alarmEmails) !== null && _a !== void 0 ? _a : []
        });
        return clusterFactory.create();
    }
    createQueues() {
        var _a;
        if (this.config.Parameters.queue) {
            let dlq = undefined;
            if ((_a = this.config.Parameters.queue.hasDeadLetterQueue) !== null && _a !== void 0 ? _a : false) {
                dlq = this.createDeadLetterQueue();
            }
            return this.createDefaultQueue(dlq);
        }
    }
    createDeadLetterQueue() {
        var _a, _b;
        const sqs = new sqs_1.Sqs(this, this.node.id);
        const duration = core_1.Duration.days((_b = (_a = this.config.Parameters.queue) === null || _a === void 0 ? void 0 : _a.retentionPeriodInDays) !== null && _b !== void 0 ? _b : 3);
        return sqs.create({
            queueName: 'dlq',
            retentionPeriod: duration,
        });
    }
    createDefaultQueue(deadLetterQueue) {
        var _a, _b;
        const sqs = new sqs_1.Sqs(this, this.node.id);
        let props = {};
        if (deadLetterQueue) {
            props['deadLetterQueue'] = {
                queue: deadLetterQueue,
                maxReceiveCount: (_b = (_a = this.config.Parameters.queue) === null || _a === void 0 ? void 0 : _a.maxReceiveCount) !== null && _b !== void 0 ? _b : 3
            };
        }
        const queue = sqs.create(props);
        // @ts-ignore
        this.config.Parameters.queue.queue = queue;
        return queue;
    }
    createDynamoDbTable(name = 'cache') {
        if (this.config.Parameters.dynamoDb) {
            const dyn = new dynamodb_1.Dynamodb(this, this.node.id);
            return dyn.create(name, this.config.Parameters.dynamoDb);
        }
        return null;
    }
    createS3Bucket(name = 's3') {
        if (this.config.Parameters.s3) {
            const s3 = new s3_1.S3(this, this.node.id);
            return s3.create(name, this.config.Parameters.s3);
        }
        return null;
    }
    createListenerRule(targetGroup) {
        const lr = new alb_listener_rule_1.AlbListenerRule(this, this.getName('listener-rule'), this.listener, this.config.Parameters.listenerRule);
        return lr.createListenerRule(targetGroup);
    }
    createTasksAndServices(cluster, props) {
        var _a, _b, _c;
        const secrets = new secrets_1.Secrets(this, this.node.id);
        const factory = new fargate_factory_1.FargateFactory(this, this.node.id, {
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
                skipCreateTask: (_a = this.config.Parameters.canCreateTask) !== null && _a !== void 0 ? _a : true
            }
        });
        return factory.create((_b = this.config.Parameters.tasks) !== null && _b !== void 0 ? _b : [], (_c = this.config.Parameters.services) !== null && _c !== void 0 ? _c : [], this.config.Parameters.queue);
    }
    createTargetGroup() {
        const tg = new alb_target_group_1.AlbTargetGroup(this, this.getName('target-group'), this.vpc, this.config);
        return tg.createApplicationTargetGroup();
    }
    getEnvironmentForContainers(envProps) {
        let props = {};
        if (this.config.Parameters.subdomain && this.config.Parameters.hostedZoneDomain) {
            const mailFromDomain = `${this.config.Parameters.subdomain}.${this.config.Parameters.hostedZoneDomain}`;
            props['MAIL_FROM_ADDRESS'] = `no-reply@${mailFromDomain}`;
            props['IMPORTER_FROM'] = `importer-no-reply@${mailFromDomain}`;
        }
        if (envProps.table) {
            props['DYNAMODB_CACHE_TABLE'] = envProps.table.tableName;
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
    getName(suffix) {
        return `${this.node.id}-${suffix}`;
    }
    handleLookups() {
        const albArn = alb_lookup_1.AlbLookup.getAlbArn(this, this.config);
        this.listener = listener_lookup_1.ListenerLookup.getApplicationListener(this, this.config, albArn);
        this.alb = alb_lookup_1.AlbLookup.getAlb(this, this.config, albArn);
        this.vpc = cdk_utils_1.VpcUtils.getVpcFromConfig(this, this.config);
    }
}
exports.EnvStack = EnvStack;
//# sourceMappingURL=env-stack.js.map