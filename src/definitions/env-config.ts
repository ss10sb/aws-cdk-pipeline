import {EnvConfig as ParentEnvConfig, EnvParameters as ParentEnvParameters} from "@smorken/cdk-utils";
import {HealthCheck} from "@aws-cdk/aws-elasticloadbalancingv2";
import {ListenerRuleProps} from "../alb/alb-listener-rule";
import {TargetGroupProps} from "../alb/alb-target-group";
import {DynamoDbProps} from "../dynamodb";
import {QueueProps, ServiceProps, TaskProps} from "./tasks-services";
import {Repositories} from "../factories/repositories";
import {S3Props} from "../s3";

export interface EnvConfig extends ParentEnvConfig {
    readonly Parameters: EnvParameters;
}

export interface EnvProps {
    readonly repositories: Repositories;
}

export interface EnvParameters extends ParentEnvParameters {
    readonly deploy?: boolean;
    readonly canCreateTask?: boolean;
    readonly hostedZoneDomain?: string;
    readonly dynamoDb?: DynamoDbProps;
    readonly subdomain?: string;
    readonly actions?: { [key: string]: object };
    readonly healthCheck?: HealthCheck;
    readonly listenerRule: ListenerRuleProps;
    readonly targetGroup: TargetGroupProps;
    readonly services: ServiceProps[];
    readonly tasks: TaskProps[];
    readonly queue?: QueueProps;
    readonly alarmEmails?: string[];
    readonly s3?: S3Props;
    secretKeys?: string[];
}
