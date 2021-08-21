import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { CodeStarSourceProps } from "../definitions/source";
import { CodePipelineSource } from "@aws-cdk/pipelines";
export declare class CodeStarSource extends NonConstruct {
    readonly props: CodeStarSourceProps;
    readonly source: CodePipelineSource;
    constructor(scope: Construct, id: string, props: CodeStarSourceProps);
    createCodeStarSource(): CodePipelineSource;
    protected getBranch(): string;
    protected getRepo(): string;
}
