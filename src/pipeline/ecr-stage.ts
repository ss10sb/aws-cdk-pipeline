import {Construct, Stack, Stage, StageProps} from "@aws-cdk/core";
import {PipelinesCodeStarSource} from "./code-star-source";
import {Repositories} from "../factories/repositories";
import {EcrStack} from "./ecr-stack";

export interface EcrStageProps extends StageProps {
    readonly repositories: Repositories;
    readonly source: PipelinesCodeStarSource;
}

export class EcrStage extends Stage {
    readonly props: EcrStageProps;
    readonly stack: Stack;

    constructor(scope: Construct, id: string, props: EcrStageProps) {
        super(scope, id, props);
        this.props = props;
        this.stack = new EcrStack(this, `stack`, {
            source: this.props.source,
            repositories: this.props.repositories
        });
    }
}
