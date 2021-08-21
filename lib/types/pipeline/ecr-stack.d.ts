import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Repositories } from "../factories/repositories";
import { CodeStarSource } from "./code-star-source";
import { EcrStep } from "./ecr-step";
export interface EcrStackProps extends StackProps {
    readonly repositories: Repositories;
    readonly source: CodeStarSource;
}
export declare class EcrStack extends Stack {
    readonly props: EcrStackProps;
    readonly steps: EcrStep[];
    constructor(scope: Construct, id: string, props: EcrStackProps);
    protected createEcrSteps(): EcrStep[];
}
