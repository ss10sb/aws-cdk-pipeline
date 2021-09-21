import { Repositories } from "../factories/repositories";
import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { FargateTasksServices } from "../factories/fargate-factory";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Queue } from "@aws-cdk/aws-sqs";
import { Bucket } from "@aws-cdk/aws-s3";
import { ICluster } from "@aws-cdk/aws-ecs";
import { StartStop } from "../start-stop/start-stop";
export interface EnvStackPermissionsProps {
    readonly cluster: ICluster;
    readonly tasksServices: FargateTasksServices;
    readonly table?: Table;
    readonly repositories: Repositories;
    readonly queue?: Queue;
    readonly s3?: Bucket;
    readonly startStop?: StartStop;
}
export declare class EnvStackPermissions extends NonConstruct {
    readonly props: EnvStackPermissionsProps;
    constructor(scope: Construct, id: string, props: EnvStackPermissionsProps);
    protected handlePermissions(): void;
    protected startStopHandler(): void;
    protected dynamoDbTable(): void;
    protected sesEmail(): void;
    protected sqsQueue(): void;
    protected s3Bucket(): void;
}
