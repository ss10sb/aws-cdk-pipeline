import {NonConstruct} from "@smorken/cdk-utils";
import {IRepository} from "@aws-cdk/aws-ecr";
import {CodePipelineCodeStarSource} from "./code-pipeline-code-star-source";
import {Construct, Stack} from "@aws-cdk/core";
import {CodeBuildStep} from "@aws-cdk/pipelines";
import {IRole} from "@aws-cdk/aws-iam";
import {LinuxBuildImage} from "@aws-cdk/aws-codebuild";

export interface CodePipelineEcrStepProps {
    readonly name: string;
    readonly repository: IRepository;
    readonly imageTag: string;
    readonly source: CodePipelineCodeStarSource;
    readonly role: IRole;
}

export class CodePipelineEcrStep extends NonConstruct {
    readonly props: CodePipelineEcrStepProps;
    readonly step: CodeBuildStep;

    constructor(scope: Construct, id: string, props: CodePipelineEcrStepProps) {
        super(scope, id);
        this.props = props;
        this.step = this.createStep();
    }

    protected createStep(): CodeBuildStep {
        return new CodeBuildStep(`${this.props.name}-ecr-step`, {
            role: this.props.role,
            env: {
                ECR_URI: this.props.repository.repositoryUri,
                DOCKER_NAME: this.props.name,
                IMAGE_TAG: this.props.imageTag,
                ECR_REGION: Stack.of(this.scope).region
            },
            buildEnvironment: {
                buildImage: LinuxBuildImage.STANDARD_5_0,
                privileged: true
            },
            commands: this.getCommands()
        });
    }

    protected getCommands(): string[] {
        return [
            'echo Login to AWS ECR',
            'aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $ECR_URI',
            'echo Build started on `date`',
            'echo "Building the Docker image: $ECR_URI:$IMAGE_TAG"',
            'docker build -t $ECR_URI:latest -t $ECR_URI:$IMAGE_TAG -f docker/Dockerfile.$DOCKER_NAME .',
            'echo Pushing the Docker image...',
            'docker push $ECR_URI:$IMAGE_TAG',
            'docker push $ECR_URI:latest',
            'echo Build completed on `date`'
        ];
    }
}
