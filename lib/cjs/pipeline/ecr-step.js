"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrStep = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const pipelines_1 = require("@aws-cdk/pipelines");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
class EcrStep extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.role = new aws_iam_1.Role(this.scope, `${this.props.name}-ecr-step-role`, {
            assumedBy: new aws_iam_1.ServicePrincipal('codebuild.amazonaws.com')
        });
        this.step = this.createStep();
    }
    createStep() {
        return new pipelines_1.CodeBuildStep(`${this.props.name}-ecr-step`, {
            role: this.role,
            env: {
                ECR_URI: this.props.repository.repositoryUri,
                DOCKER_NAME: this.props.name,
                IMAGE_TAG: this.props.imageTag
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
exports.EcrStep = EcrStep;
//# sourceMappingURL=ecr-step.js.map