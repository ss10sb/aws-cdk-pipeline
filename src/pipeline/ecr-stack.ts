import {Construct, Stack, StackProps} from "@aws-cdk/core";
import {Repositories} from "../factories/repositories";
import {PipelinesCodeStarSource} from "./code-star-source";
import {EcrStep} from "./ecr-step";

export interface EcrStackProps extends StackProps {
    readonly repositories: Repositories;
    readonly source: PipelinesCodeStarSource;
}

export class EcrStack extends Stack {
    readonly props: EcrStackProps;
    readonly steps: EcrStep[];

    constructor(scope: Construct, id: string, props: EcrStackProps) {
        super(scope, id, props);
        this.props = props;
        this.steps = this.createEcrSteps();
    }

    protected createEcrSteps(): EcrStep[] {
        let steps: EcrStep[] = [];
        for (const [name, repo] of this.props.repositories.repoEntries()) {
            steps.push(new EcrStep(this, `${this.node.id}-${name}-ecr-step`, {
                source: this.props.source,
                imageTag: this.props.repositories.getTagForImage(name),
                name: name,
                repository: repo
            }));
        }
        return steps;
    }
}
