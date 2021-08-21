import {Repositories} from "../factories/repositories";
import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {FargateTasksServices} from "../factories/fargate-factory";
import {Table} from "@aws-cdk/aws-dynamodb";
import {Queue} from "@aws-cdk/aws-sqs";
import {Permissions} from "../factories/permissions";

export interface EnvStackPermissionsProps {
    readonly tasksServices: FargateTasksServices;
    readonly table?: Table;
    readonly repositories: Repositories;
    readonly queue?: Queue;
}

export class EnvStackPermissions extends NonConstruct {
    readonly props: EnvStackPermissionsProps;

    constructor(scope: Construct, id: string, props: EnvStackPermissionsProps) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }

    protected handlePermissions(): void {
        this.dynamoDbTable();
        this.sqsQueue();
        this.sesEmail();
    }

    protected dynamoDbTable(): void {
        if (this.props.table) {
            Permissions.tasksServicesCanReadWriteDynamoDb(this.props.tasksServices, this.props.table);
        }
    }

    protected sesEmail(): void {
        Permissions.tasksServicesCanSendEmail(this.props.tasksServices);
    }

    protected sqsQueue(): void {
        if (this.props.queue) {
            Permissions.tasksServicesCanUseQueue(this.props.tasksServices, this.props.queue);
        }
    }
}
