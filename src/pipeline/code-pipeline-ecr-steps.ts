import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {CodeBuildStep} from "@aws-cdk/pipelines";
import {IRole, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {Repositories} from "../factories/repositories";
import {CodePipelineCodeStarSource} from "./code-pipeline-code-star-source";
import {CodePipelineEcrStep} from "./code-pipeline-ecr-step";

export interface CodePipelineEcrStepsProps {
    repositories: Repositories;
    source: CodePipelineCodeStarSource;
}

export class CodePipelineEcrSteps extends NonConstruct {
    readonly props: CodePipelineEcrStepsProps;
    readonly steps: CodeBuildStep[];
    readonly role: IRole;

    constructor(scope: Construct, id: string, props: CodePipelineEcrStepsProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, `${this.scope.node.id}-ecr-step-role`, {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.steps = this.createEcrSteps();
    }

    private createEcrSteps(): CodeBuildStep[] {
        let steps: CodeBuildStep[] = [];
        for (const [name, repo] of this.props.repositories.repoEntries()) {
            const ecrStep = new CodePipelineEcrStep(this.scope, `${this.scope.node.id}-${name}-step`, {
                role: this.role,
                source: this.props.source,
                imageTag: this.props.repositories.getTagForImage(name),
                name: name,
                repository: repo
            });
            steps.push(ecrStep.step);
        }
        return steps;
    }
}