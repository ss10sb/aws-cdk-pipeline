"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterFactory = void 0;
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_sns_1 = require("@aws-cdk/aws-sns");
const aws_sns_subscriptions_1 = require("@aws-cdk/aws-sns-subscriptions");
const aws_cloudwatch_actions_1 = require("@aws-cdk/aws-cloudwatch-actions");
const abstract_factory_1 = require("./abstract-factory");
class ClusterFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
    }
    create() {
        const name = this.mixNameWithId('cluster');
        const cluster = new aws_ecs_1.Cluster(this.scope, name, {
            vpc: this.props.vpc,
            containerInsights: true,
            clusterName: name
        });
        this.createAlarms(cluster);
        return cluster;
    }
    createAlarms(cluster) {
        if (this.props.alarmEmails && this.props.alarmEmails.length) {
            let alarms = [];
            const topic = new aws_sns_1.Topic(this.scope, this.mixNameWithId('cluster-alarm-topic'));
            this.addSubscriptions(topic, this.props.alarmEmails);
            alarms.push(cluster.metricCpuUtilization().createAlarm(this.scope, this.mixNameWithId('cluster-cpu-alarm'), {
                threshold: 90,
                evaluationPeriods: 1
            }));
            alarms.push(cluster.metricMemoryUtilization().createAlarm(this.scope, this.mixNameWithId('cluster-memory-alarm'), {
                threshold: 90,
                evaluationPeriods: 1
            }));
            this.addActions(alarms, topic);
        }
    }
    addActions(alarms, topic) {
        for (const alarm of alarms) {
            alarm.addAlarmAction(new aws_cloudwatch_actions_1.SnsAction(topic));
            alarm.addOkAction(new aws_cloudwatch_actions_1.SnsAction(topic));
        }
    }
    addSubscriptions(topic, emails) {
        for (const email of emails) {
            topic.addSubscription(new aws_sns_subscriptions_1.EmailSubscription(email));
        }
    }
}
exports.ClusterFactory = ClusterFactory;
//# sourceMappingURL=cluster-factory.js.map