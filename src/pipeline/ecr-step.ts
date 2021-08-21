import {NonConstruct} from "@smorken/cdk-utils";
import {IRepository} from "@aws-cdk/aws-ecr";
import {CodeStarSource} from "./code-star-source";
import {Construct} from "@aws-cdk/core";
import {CodeBuildStep} from "@aws-cdk/pipelines";
import {IRole, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {LinuxBuildImage} from "@aws-cdk/aws-codebuild";

export interface EcrStepProps {
    readonly name: string;
    readonly repository: IRepository;
    readonly imageTag: string;
    readonly source: CodeStarSource;
}

export class EcrStep extends NonConstruct {
    readonly props: EcrStepProps;
    readonly step: CodeBuildStep;
    readonly role: IRole;

    constructor(scope: Construct, id: string, props: EcrStepProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, `${this.props.name}-ecr-step-role`, {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.step = this.createStep();
    }

    protected createStep(): CodeBuildStep {
        return new CodeBuildStep(`${this.props.name}-ecr-step`, {
            role: this.role,
            env: {
                ECR_URI: this.props.repository.repositoryUri,
                DOCKER_NAME: this.props.name,
                IMAGE_TAG: this.props.imageTag
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
