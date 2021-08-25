import {TaskDefinition} from "@aws-cdk/aws-ecs";
import {IGrantable, PolicyStatement} from "@aws-cdk/aws-iam";
import {Table} from "@aws-cdk/aws-dynamodb";
import {Queue} from "@aws-cdk/aws-sqs";
import {IStringParameter} from "@aws-cdk/aws-ssm";
import {Repositories} from "./repositories";
import {FargateTasksServices} from "./fargate-factory";
import {TaskServiceType, Wrapper} from "../definitions/tasks-services";
import {CfnRepository} from "@aws-cdk/aws-ecr";
import {Bucket} from "@aws-cdk/aws-s3";

export class Permissions {

    static accountIdsCanPullFromEcr(accountIds: string[], repositories: Repositories): void {
        function accountArns(accountIds: string[]): string[] {
            let arns: string[] = [];
            for (const accountId of accountIds) {
                arns.push(`arn:aws:iam::${accountId}:root`);
            }
            return arns;
        }

        for (const [name, repo] of repositories.repoEntries()) {
            const cfnRepo = repo.node.defaultChild as CfnRepository;
            cfnRepo.repositoryPolicyText = {
                "Version": "2008-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": accountArns(accountIds)
                        },
                        "Action": [
                            "ecr:BatchCheckLayerAvailability",
                            "ecr:BatchGetImage",
                            "ecr:GetDownloadUrlForLayer",
                            "ecr:DescribeImages"
                        ]
                    }
                ]
            }
        }
    }

    static accountIdsCanDescribeEcr(accountIds: string[], repositories: Repositories): void {
        function accountArns(accountIds: string[]): string[] {
            let arns: string[] = [];
            for (const accountId of accountIds) {
                arns.push(`arn:aws:iam::${accountId}:root`);
            }
            return arns;
        }

        for (const [name, repo] of repositories.repoEntries()) {
            const cfnRepo = repo.node.defaultChild as CfnRepository;
            cfnRepo.repositoryPolicyText = {
                "Version": "2008-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": accountArns(accountIds)
                        },
                        "Action": [
                            "ecr:DescribeImages"
                        ]
                    }
                ]
            }
        }
    }

    static policyStatementForBootstrapRole(role: string = 'lookup'): PolicyStatement {
        return new PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: ['*'],
            conditions: {
                StringEquals: {
                    'iam:ResourceTag/aws-cdk:bootstrap-role': role,
                },
            },
        });
    }

    static granteeCanReadParam(grantee: IGrantable, param: IStringParameter): void {
        param.grantRead(grantee);
    }

    static granteeCanPushPullFromRepositories(grantee: IGrantable, repositories: Repositories): void {
        for (const [name, repo] of repositories.repoEntries()) {
            repo.grantPullPush(grantee);
        }
    }

    static granteeCanPullFromRepositories(grantee: IGrantable, repositories: Repositories): void {
        for (const [name, repo] of repositories.repoEntries()) {
            repo.grantPull(grantee);
        }
    }

    static granteeCanDescribeRepositories(grantee: IGrantable, repositories: Repositories): void {
        for (const [name, repo] of repositories.repoEntries()) {
            repo.grant(grantee, 'ecr:DescribeImages');
        }
    }

    static tasksServicesCanPullFromEcr(ts: FargateTasksServices, repositories: Repositories): void {
        Permissions.wrappedCanPullFromEcr(ts.services, repositories);
        Permissions.wrappedCanPullFromEcr(ts.tasks, repositories);
        if (ts.queue) {
            Permissions.wrappedCanPullFromEcr([ts.queue], repositories);
        }
    }

    static wrappedCanPullFromEcr(wrapped: Wrapper[], repositories: Repositories): void {
        for (const wrap of wrapped) {
            Permissions.executionRoleCanPullFromEcr(wrap.taskDefinition, repositories);
        }
    }

    static executionRoleCanPullFromEcr(taskDefinition: TaskDefinition, repositories: Repositories): void {
        let repoArns: string[] = [];
        for (const [name, repo] of repositories.repoEntries()) {
            repoArns.push(repo.repositoryArn + '*');
        }
        if (repoArns.length) {
            const statement = new PolicyStatement();
            statement.addResources(...repoArns);
            statement.addActions(
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability"
            );
            taskDefinition.obtainExecutionRole().addToPrincipalPolicy(statement);
        }
        Permissions.executionRoleCanGetEcrAuthToken(taskDefinition);
    }

    static executionRoleCanGetEcrAuthToken(taskDefinition: TaskDefinition): void {
        const statement = new PolicyStatement();
        statement.addResources('*');
        statement.addActions(
            "ecr:GetAuthorizationToken"
        );
        taskDefinition.obtainExecutionRole().addToPrincipalPolicy(statement);
    }

    static tasksServicesCanReadWriteDynamoDb(ts: FargateTasksServices, dynamodb: Table): void {
        Permissions.wrappedCanReadWriteDynamoDb(ts.services, dynamodb);
        Permissions.wrappedCanReadWriteDynamoDb(ts.tasks, dynamodb);
        if (ts.queue) {
            Permissions.wrappedCanReadWriteDynamoDb([ts.queue], dynamodb);
        }
    }

    static wrappedCanReadWriteDynamoDb(wrapped: Wrapper[], dynamodb: Table): void {
        for (const wrap of wrapped) {
            Permissions.taskRoleCanReadWriteDynamoDb(wrap.taskDefinition, dynamodb);
        }
    }

    static taskRoleCanReadWriteDynamoDb(taskDefinition: TaskDefinition, dynamodb: Table): void {
        dynamodb.grantReadWriteData(taskDefinition.taskRole);
    }

    static tasksServicesCanUseQueue(ts: FargateTasksServices, queue: Queue): void {
        Permissions.wrappedCanUseQueue(ts.services, queue);
        Permissions.wrappedCanUseQueue(ts.tasks, queue);
        if (ts.queue) {
            Permissions.wrappedCanUseQueue([ts.queue], queue);
        }
    }

    static tasksServicesCanReadWriteS3(ts: FargateTasksServices, s3: Bucket): void {
        Permissions.wrappedCanReadWriteS3(ts.services, s3);
        Permissions.wrappedCanReadWriteS3(ts.tasks, s3);
        if (ts.queue) {
            Permissions.wrappedCanReadWriteS3([ts.queue], s3);
        }
    }

    static wrappedCanReadWriteS3(wrapped: Wrapper[], s3: Bucket): void {
        for (const wrap of wrapped) {
            Permissions.taskRoleCanReadWriteS3(wrap.taskDefinition, s3);
        }
    }

    static taskRoleCanReadWriteS3(taskDefinition: TaskDefinition, s3: Bucket): void {
        s3.grantReadWrite(taskDefinition.taskRole);
    }

    static wrappedCanUseQueue(wrapped: Wrapper[], queue: Queue): void {
        for (const wrap of wrapped) {
            this.taskRoleCanUseQueue(wrap.taskDefinition, queue, wrap.type);
        }
    }

    static taskRoleCanUseQueue(taskDefinition: TaskDefinition, queue: Queue, type: TaskServiceType = TaskServiceType.TASK): void {
        const senders: TaskServiceType[] = [TaskServiceType.TASK, TaskServiceType.SCHEDULED_TASK, TaskServiceType.WEB_SERVICE];
        const consumers: TaskServiceType[] = [TaskServiceType.QUEUE_SERVICE];
        if (senders.includes(type)) {
            queue.grantSendMessages(taskDefinition.taskRole);
        }
        if (consumers.includes(type)) {
            queue.grantPurge(taskDefinition.taskRole);
            queue.grantConsumeMessages(taskDefinition.taskRole);
        }
    }

    static tasksServicesCanSendEmail(ts: FargateTasksServices): void {
        Permissions.wrappedCanSendEmail(ts.services);
        Permissions.wrappedCanSendEmail(ts.tasks);
        if (ts.queue) {
            Permissions.wrappedCanSendEmail([ts.queue]);
        }
    }

    static wrappedCanSendEmail(wrapped: Wrapper[]): void {
        for (const wrap of wrapped) {
            Permissions.taskRoleCanSendEmail(wrap.taskDefinition);
        }
    }

    static taskRoleCanSendEmail(taskDefinition: TaskDefinition): void {
        const statement = new PolicyStatement();
        statement.addResources('*');
        statement.addActions(
            "ses:SendEmail",
            "ses:SendRawEmail"
        );
        taskDefinition.taskRole.addToPrincipalPolicy(statement);
    }
}
