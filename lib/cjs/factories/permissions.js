"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = void 0;
const aws_iam_1 = require("@aws-cdk/aws-iam");
const tasks_services_1 = require("../definitions/tasks-services");
class Permissions {
    static accountIdsCanPullFromEcr(accountIds, repositories) {
        function accountArns(accountIds) {
            let arns = [];
            for (const accountId of accountIds) {
                arns.push(`arn:aws:iam::${accountId}:root`);
            }
            return arns;
        }
        for (const [name, repo] of repositories.repoEntries()) {
            const cfnRepo = repo.node.defaultChild;
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
            };
        }
    }
    static accountIdsCanDescribeEcr(accountIds, repositories) {
        function accountArns(accountIds) {
            let arns = [];
            for (const accountId of accountIds) {
                arns.push(`arn:aws:iam::${accountId}:root`);
            }
            return arns;
        }
        for (const [name, repo] of repositories.repoEntries()) {
            const cfnRepo = repo.node.defaultChild;
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
            };
        }
    }
    static policyStatementForBootstrapRole(role = 'lookup') {
        return new aws_iam_1.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: ['*'],
            conditions: {
                StringEquals: {
                    'iam:ResourceTag/aws-cdk:bootstrap-role': role,
                },
            },
        });
    }
    static granteeCanReadParam(grantee, param) {
        param.grantRead(grantee);
    }
    static granteeCanPushPullFromRepositories(grantee, repositories) {
        for (const [name, repo] of repositories.repoEntries()) {
            repo.grantPullPush(grantee);
        }
    }
    static granteeCanPullFromRepositories(grantee, repositories) {
        for (const [name, repo] of repositories.repoEntries()) {
            repo.grantPull(grantee);
        }
    }
    static granteeCanDescribeRepositories(grantee, repositories) {
        for (const [name, repo] of repositories.repoEntries()) {
            repo.grant(grantee, 'ecr:DescribeImages');
        }
    }
    static lambdaCanUpdateCluster(fn, cluster) {
        fn.addToRolePolicy(new aws_iam_1.PolicyStatement({
            actions: [
                'ecs:ListServices'
            ],
            resources: ['*']
        }));
        fn.addToRolePolicy(new aws_iam_1.PolicyStatement({
            actions: [
                'ecs:DescribeServices',
                'ecs:UpdateService',
            ],
            resources: ['*'],
            conditions: {
                'ArnEquals': {
                    'ecs:cluster': cluster.clusterArn
                }
            }
        }));
    }
    static tasksServicesCanPullFromEcr(ts, repositories) {
        Permissions.wrappedCanPullFromEcr(ts.services, repositories);
        Permissions.wrappedCanPullFromEcr(ts.tasks, repositories);
        if (ts.queue) {
            Permissions.wrappedCanPullFromEcr([ts.queue], repositories);
        }
    }
    static wrappedCanPullFromEcr(wrapped, repositories) {
        for (const wrap of wrapped) {
            Permissions.executionRoleCanPullFromEcr(wrap.taskDefinition, repositories);
        }
    }
    static executionRoleCanPullFromEcr(taskDefinition, repositories) {
        let repoArns = [];
        for (const [name, repo] of repositories.repoEntries()) {
            repoArns.push(repo.repositoryArn + '*');
        }
        if (repoArns.length) {
            const statement = new aws_iam_1.PolicyStatement();
            statement.addResources(...repoArns);
            statement.addActions("ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:BatchCheckLayerAvailability");
            taskDefinition.obtainExecutionRole().addToPrincipalPolicy(statement);
        }
        Permissions.executionRoleCanGetEcrAuthToken(taskDefinition);
    }
    static executionRoleCanGetEcrAuthToken(taskDefinition) {
        const statement = new aws_iam_1.PolicyStatement();
        statement.addResources('*');
        statement.addActions("ecr:GetAuthorizationToken");
        taskDefinition.obtainExecutionRole().addToPrincipalPolicy(statement);
    }
    static tasksServicesCanReadWriteDynamoDb(ts, dynamodb) {
        Permissions.wrappedCanReadWriteDynamoDb(ts.services, dynamodb);
        Permissions.wrappedCanReadWriteDynamoDb(ts.tasks, dynamodb);
        if (ts.queue) {
            Permissions.wrappedCanReadWriteDynamoDb([ts.queue], dynamodb);
        }
    }
    static wrappedCanReadWriteDynamoDb(wrapped, dynamodb) {
        for (const wrap of wrapped) {
            Permissions.taskRoleCanReadWriteDynamoDb(wrap.taskDefinition, dynamodb);
        }
    }
    static taskRoleCanReadWriteDynamoDb(taskDefinition, dynamodb) {
        dynamodb.grantReadWriteData(taskDefinition.taskRole);
    }
    static tasksServicesCanUseQueue(ts, queue) {
        Permissions.wrappedCanUseQueue(ts.services, queue);
        Permissions.wrappedCanUseQueue(ts.tasks, queue);
        if (ts.queue) {
            Permissions.wrappedCanUseQueue([ts.queue], queue);
        }
    }
    static tasksServicesCanReadWriteS3(ts, s3) {
        Permissions.wrappedCanReadWriteS3(ts.services, s3);
        Permissions.wrappedCanReadWriteS3(ts.tasks, s3);
        if (ts.queue) {
            Permissions.wrappedCanReadWriteS3([ts.queue], s3);
        }
    }
    static wrappedCanReadWriteS3(wrapped, s3) {
        for (const wrap of wrapped) {
            Permissions.taskRoleCanReadWriteS3(wrap.taskDefinition, s3);
        }
    }
    static taskRoleCanReadWriteS3(taskDefinition, s3) {
        s3.grantReadWrite(taskDefinition.taskRole);
    }
    static wrappedCanUseQueue(wrapped, queue) {
        for (const wrap of wrapped) {
            this.taskRoleCanUseQueue(wrap.taskDefinition, queue, wrap.type);
        }
    }
    static taskRoleCanUseQueue(taskDefinition, queue, type = tasks_services_1.TaskServiceType.TASK) {
        const senders = [tasks_services_1.TaskServiceType.TASK, tasks_services_1.TaskServiceType.SCHEDULED_TASK, tasks_services_1.TaskServiceType.WEB_SERVICE];
        const consumers = [tasks_services_1.TaskServiceType.QUEUE_SERVICE];
        if (senders.includes(type)) {
            queue.grantSendMessages(taskDefinition.taskRole);
        }
        if (consumers.includes(type)) {
            queue.grantPurge(taskDefinition.taskRole);
            queue.grantConsumeMessages(taskDefinition.taskRole);
        }
    }
    static tasksServicesCanSendEmail(ts) {
        Permissions.wrappedCanSendEmail(ts.services);
        Permissions.wrappedCanSendEmail(ts.tasks);
        if (ts.queue) {
            Permissions.wrappedCanSendEmail([ts.queue]);
        }
    }
    static wrappedCanSendEmail(wrapped) {
        for (const wrap of wrapped) {
            Permissions.taskRoleCanSendEmail(wrap.taskDefinition);
        }
    }
    static taskRoleCanSendEmail(taskDefinition) {
        const statement = new aws_iam_1.PolicyStatement();
        statement.addResources('*');
        statement.addActions("ses:SendEmail", "ses:SendRawEmail");
        taskDefinition.taskRole.addToPrincipalPolicy(statement);
    }
}
exports.Permissions = Permissions;
//# sourceMappingURL=permissions.js.map