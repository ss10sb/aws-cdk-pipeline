import { TaskDefinition } from "@aws-cdk/aws-ecs";
import { IGrantable, PolicyStatement } from "@aws-cdk/aws-iam";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Queue } from "@aws-cdk/aws-sqs";
import { IStringParameter } from "@aws-cdk/aws-ssm";
import { Repositories } from "./repositories";
import { FargateTasksServices } from "./fargate-factory";
import { TaskServiceType, Wrapper } from "../definitions/tasks-services";
export declare class Permissions {
    static accountIdsCanPullFromEcr(accountIds: string[], repositories: Repositories): void;
    static accountIdsCanDescribeEcr(accountIds: string[], repositories: Repositories): void;
    static policyStatementForBootstrapRole(role?: string): PolicyStatement;
    static granteeCanReadParam(grantee: IGrantable, param: IStringParameter): void;
    static granteeCanPushPullFromRepositories(grantee: IGrantable, repositories: Repositories): void;
    static granteeCanPullFromRepositories(grantee: IGrantable, repositories: Repositories): void;
    static granteeCanDescribeRepositories(grantee: IGrantable, repositories: Repositories): void;
    static tasksServicesCanPullFromEcr(ts: FargateTasksServices, repositories: Repositories): void;
    static wrappedCanPullFromEcr(wrapped: Wrapper[], repositories: Repositories): void;
    static executionRoleCanPullFromEcr(taskDefinition: TaskDefinition, repositories: Repositories): void;
    static executionRoleCanGetEcrAuthToken(taskDefinition: TaskDefinition): void;
    static tasksServicesCanReadWriteDynamoDb(ts: FargateTasksServices, dynamodb: Table): void;
    static wrappedCanReadWriteDynamoDb(wrapped: Wrapper[], dynamodb: Table): void;
    static taskRoleCanReadWriteDynamoDb(taskDefinition: TaskDefinition, dynamodb: Table): void;
    static tasksServicesCanUseQueue(ts: FargateTasksServices, queue: Queue): void;
    static wrappedCanUseQueue(wrapped: Wrapper[], queue: Queue): void;
    static taskRoleCanUseQueue(taskDefinition: TaskDefinition, queue: Queue, type?: TaskServiceType): void;
    static tasksServicesCanSendEmail(ts: FargateTasksServices): void;
    static wrappedCanSendEmail(wrapped: Wrapper[]): void;
    static taskRoleCanSendEmail(taskDefinition: TaskDefinition): void;
}
