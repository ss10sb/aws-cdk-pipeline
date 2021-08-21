import { NonConstruct } from "@smorken/cdk-utils";
import { Construct, Duration } from "@aws-cdk/core";
import { DeadLetterQueue, Queue, QueueEncryption } from "@aws-cdk/aws-sqs";
export interface SqsProps {
    queueName?: string;
    encryption?: QueueEncryption;
    deadLetterQueue?: DeadLetterQueue;
    retentionPeriod?: Duration;
}
export declare class Sqs extends NonConstruct {
    readonly defaults: {
        [key: string]: any;
    };
    constructor(scope: Construct, id: string);
    create(props: SqsProps): Queue;
    private getQueueName;
}
