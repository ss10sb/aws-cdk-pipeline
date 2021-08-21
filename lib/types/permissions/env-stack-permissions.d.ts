import { Repositories } from "../factories/repositories";
import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { FargateTasksServices } from "../factories/fargate-factory";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Queue } from "@aws-cdk/aws-sqs";
export interface EnvStackPermissionsProps {
    readonly tasksServices: FargateTasksServices;
    readonly table?: Table;
    readonly repositories: Repositories;
    readonly queue?: Queue;
}
export declare class EnvStackPermissions extends NonConstruct {
    readonly props: EnvStackPermissionsProps;
    constructor(scope: Construct, id: string, props: EnvStackPermissionsProps);
    protected handlePermissions(): void;
    protected dynamoDbTable(): void;
    protected sesEmail(): void;
    protected sqsQueue(): void;
}
