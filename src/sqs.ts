import {NonConstruct} from "@smorken/cdk-utils";
import {Construct, Duration} from "@aws-cdk/core";
import {DeadLetterQueue, Queue, QueueEncryption} from "@aws-cdk/aws-sqs";

export interface SqsProps {
    queueName?: string;
    encryption?: QueueEncryption;
    deadLetterQueue?: DeadLetterQueue;
    retentionPeriod?: Duration;
}

export class Sqs extends NonConstruct {
    readonly defaults: { [key: string]: any };

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.defaults = {
            queueName: this.mixNameWithId('queue'),
            encryption: QueueEncryption.KMS_MANAGED
        }
    }

    create(props: SqsProps): Queue {
        const queueName = this.getQueueName(props);
        props.queueName = queueName;
        return new Queue(this.scope, queueName, {
            queueName: props.queueName,
            encryption: props.encryption ?? this.defaults.encryption,
            deadLetterQueue: props.deadLetterQueue ?? undefined,
            retentionPeriod: props.retentionPeriod ?? undefined
        });
    }

    private getQueueName(props: SqsProps): string {
        if (props.queueName) {
            return this.mixNameWithId(props.queueName);
        }
        return this.defaults.queueName;
    }
}
