import {Construct} from "@aws-cdk/core";
import {Action, CodeStarConnectionsSourceAction} from "@aws-cdk/aws-codepipeline-actions";
import {Artifact} from "@aws-cdk/aws-codepipeline";
import {NonConstruct} from "@smorken/cdk-utils";
import {CodeStarSourceProps, SourceProps} from "../definitions/source";

export interface Source {
    readonly sourceAction: Action;
    readonly sourceArtifact: Artifact;

    createSourceAction(props: SourceProps): Action;
}

export class CodeStarSource extends NonConstruct implements Source {
    readonly sourceAction: Action;
    readonly sourceArtifact: Artifact;

    constructor(scope: Construct, id: string, props: CodeStarSourceProps) {
        super(scope, id);
        this.sourceArtifact = new Artifact();
        this.sourceAction = this.createSourceAction(props);
    }

    createSourceAction(props: CodeStarSourceProps): Action {
        return new CodeStarConnectionsSourceAction({
            actionName: 'codestar-source',
            owner: props.owner,
            repo: props.repo,
            connectionArn: props.connectionArn,
            branch: props.branch ?? 'main',
            output: this.sourceArtifact
        });
    }
}
