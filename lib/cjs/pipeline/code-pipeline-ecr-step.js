"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineEcrStep = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const core_1 = require("@aws-cdk/core");
const pipelines_1 = require("@aws-cdk/pipelines");
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
class CodePipelineEcrStep extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.step = this.createStep();
    }
    createStep() {
        return new pipelines_1.CodeBuildStep(`${this.props.name}-ecr-step`, {
            role: this.props.role,
            env: {
                ECR_URI: this.props.repository.repositoryUri,
                DOCKER_NAME: this.props.name,
                IMAGE_TAG: this.props.imageTag,
                ECR_REGION: core_1.Stack.of(this.scope).region
            },
            buildEnvironment: {
                buildImage: aws_codebuild_1.LinuxBuildImage.STANDARD_5_0,
                privileged: true
            },
            commands: this.getCommands()
        });
    }
    getCommands() {
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
exports.CodePipelineEcrStep = CodePipelineEcrStep;
//# sourceMappingURL=code-pipeline-ecr-step.js.map