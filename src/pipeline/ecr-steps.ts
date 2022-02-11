import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {CodeBuildStep} from "@aws-cdk/pipelines";
import {IRole, Role, ServicePrincipal} from "@aws-cdk/aws-iam";
import {Repositories} from "../factories/repositories";
import {PipelinesCodeStarSource} from "./code-star-source";
import {EcrStep} from "./ecr-step";

export interface EcrStepsProps {
    repositories: Repositories;
    source: PipelinesCodeStarSource;
}

export class EcrSteps extends NonConstruct {
    readonly props: EcrStepsProps;
    readonly steps: CodeBuildStep[];
    readonly role: IRole;

    constructor(scope: Construct, id: string, props: EcrStepsProps) {
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
            const ecrStep = new EcrStep(this.scope, `${this.scope.node.id}-${name}-step`, {
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