"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrCodeBuild = void 0;
const core_1 = require("@aws-cdk/core");
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk_utils_1 = require("@smorken/cdk-utils");
class EcrCodeBuild extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.buildRole = this.createBuildRole();
        this.actions = this.createCodeBuildActions();
    }
    createBuildRole() {
        return new aws_iam_1.Role(this.scope, this.mixNameWithId('ecr-build-role'), {
            assumedBy: new aws_iam_1.ServicePrincipal('codebuild.amazonaws.com')
        });
    }
    createCodeBuildActions() {
        let actions = [];
        for (const [name, repo] of this.props.repositories.repoEntries()) {
            actions.push(this.createCodeBuildAction({
                source: this.props.source,
                repository: repo,
                name: name,
                imageTag: this.props.repositories.getTagForImage(name)
            }));
        }
        return actions;
    }
    createCodeBuildAction(props) {
        return new aws_codepipeline_actions_1.CodeBuildAction({
            actionName: `build-container-${props.name}`,
            input: props.source.sourceArtifact,
            project: new aws_codebuild_1.Project(this.scope, this.mixNameWithId(`docker-build-${props.name}`), {
                role: this.buildRole,
                projectName: this.mixNameWithId(`docker-build-${props.name}`),
                environment: {
                    buildImage: aws_codebuild_1.LinuxBuildImage.STANDARD_5_0,
                    privileged: true
                },
                environmentVariables: {
                    ECR_URI: {
                        value: props.repository.repositoryUri
                    },
                    LOGIN_COMMAND: {
                        value: `aws ecr get-login-password --region ${core_1.Stack.of(this.scope).region} | docker login --username AWS --password-stdin $ECR_URI`
                    },
                    DOCKER_NAME: {
                        value: props.name
                    },
                    IMAGE_TAG: {
                        value: props.imageTag
                    }
                },
                buildSpec: this.getBuildSpec(),
                concurrentBuildLimit: 1
            })
        });
    }
    getBuildSpec() {
        return aws_codebuild_1.BuildSpec.fromObject({
            version: '0.2',
            phases: {
                pre_build: {
                    commands: [
                        'echo Logging in to Amazon ECR...',
                        'aws --version',
                        'eval $LOGIN_COMMAND'
                    ]
                },
                build: {
                    commands: [
                        'echo Build started on `date`',
                        'echo "Building the Docker image: $ECR_URI:$IMAGE_TAG"',
                        'docker build -t $ECR_URI:latest -t $ECR_URI:$IMAGE_TAG -f docker/Dockerfile.$DOCKER_NAME .'
                    ]
                },
                post_build: {
                    commands: [
                        'echo Pushing the Docker image...',
                        'docker push $ECR_URI:$IMAGE_TAG',
                        'docker push $ECR_URI:latest',
                        'echo Build completed on `date`'
                    ]
                }
            }
        });
    }
}
exports.EcrCodeBuild = EcrCodeBuild;
//# sourceMappingURL=ecr-code-build.js.map