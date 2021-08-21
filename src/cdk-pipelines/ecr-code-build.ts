import {Construct, Stack} from "@aws-cdk/core";
import {CodeBuildAction} from "@aws-cdk/aws-codepipeline-actions";
import {Source} from "./source-actions";
import {BuildSpec, LinuxBuildImage, Project} from "@aws-cdk/aws-codebuild";
import {Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {IRepository} from "@aws-cdk/aws-ecr";
import {Repositories} from "../factories/repositories";
import {NonConstruct} from "@smorken/cdk-utils";

export interface EcrCodeBuildProps {
    readonly source: Source;
    readonly repositories: Repositories;
}

export interface EcrCodeBuildActionProps {
    readonly source: Source;
    readonly repository: IRepository;
    readonly name: string;
    readonly imageTag: string;
}

export class EcrCodeBuild extends NonConstruct {
    readonly actions: CodeBuildAction[];
    readonly buildRole: Role;
    readonly props: EcrCodeBuildProps;

    constructor(scope: Construct, id: string, props: EcrCodeBuildProps) {
        super(scope, id);
        this.props = props;
        this.buildRole = this.createBuildRole();
        this.actions = this.createCodeBuildActions();
    }

    private createBuildRole(): Role {
        return new Role(this.scope, this.mixNameWithId('ecr-build-role'), {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
    }

    private createCodeBuildActions(): CodeBuildAction[] {
        let actions: CodeBuildAction[] = [];
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

    private createCodeBuildAction(props: EcrCodeBuildActionProps): CodeBuildAction {
        return new CodeBuildAction({
            actionName: `build-container-${props.name}`,
            input: props.source.sourceArtifact,
            project: new Project(this.scope, this.mixNameWithId(`docker-build-${props.name}`), {
                role: this.buildRole,
                projectName: this.mixNameWithId(`docker-build-${props.name}`),
                environment: {
                    buildImage: LinuxBuildImage.STANDARD_5_0,
                    privileged: true
                },
                environmentVariables: {
                    ECR_URI: {
                        value: props.repository.repositoryUri
                    },
                    LOGIN_COMMAND: {
                        value: `aws ecr get-login-password --region ${Stack.of(this.scope).region} | docker login --username AWS --password-stdin $ECR_URI`
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

    private getBuildSpec(): BuildSpec {
        return BuildSpec.fromObject({
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
        })
    }
}
