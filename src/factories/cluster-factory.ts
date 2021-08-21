import {Construct} from "@aws-cdk/core";
import {Cluster} from "@aws-cdk/aws-ecs";
import {Topic} from "@aws-cdk/aws-sns";
import {EmailSubscription} from "@aws-cdk/aws-sns-subscriptions";
import {Alarm} from "@aws-cdk/aws-cloudwatch";
import {SnsAction} from "@aws-cdk/aws-cloudwatch-actions";
import {IVpc} from "@aws-cdk/aws-ec2";
import {AbstractFactory} from "./abstract-factory";

export interface ClusterFactoryProps {
    alarmEmails?: string[];
    vpc: IVpc;
    securityGroupIds?: string[];
}

export class ClusterFactory extends AbstractFactory {
    readonly props: ClusterFactoryProps;

    constructor(scope: Construct, id: string, props: ClusterFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(): Cluster {
        const name = this.mixNameWithId('cluster');
        const cluster = new Cluster(this.scope, name, {
            vpc: this.props.vpc,
            containerInsights: true,
            clusterName: name
        });
        this.createAlarms(cluster);
        return cluster;
    }

    private createAlarms(cluster: Cluster) {
        if (this.props.alarmEmails && this.props.alarmEmails.length) {
            let alarms: Alarm[] = []
            const topic = new Topic(this.scope, this.mixNameWithId('cluster-alarm-topic'));
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

    private addActions(alarms: Alarm[], topic: Topic): void {
        for (const alarm of alarms) {
            alarm.addAlarmAction(new SnsAction(topic));
            alarm.addOkAction(new SnsAction(topic));
        }
    }

    private addSubscriptions(topic: Topic, emails: string[]): void {
        for (const email of emails) {
            topic.addSubscription(new EmailSubscription(email));
        }
    }
}
