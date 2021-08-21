import { Construct } from "@aws-cdk/core";
import { Action } from "@aws-cdk/aws-codepipeline-actions";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { NonConstruct } from "@smorken/cdk-utils";
import { CodeStarSourceProps, SourceProps } from "../definitions/source";
export interface Source {
    readonly sourceAction: Action;
    readonly sourceArtifact: Artifact;
    createSourceAction(props: SourceProps): Action;
}
export declare class CodeStarSource extends NonConstruct implements Source {
    readonly sourceAction: Action;
    readonly sourceArtifact: Artifact;
    constructor(scope: Construct, id: string, props: CodeStarSourceProps);
    createSourceAction(props: CodeStarSourceProps): Action;
}
