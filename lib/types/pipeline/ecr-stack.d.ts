import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Repositories } from "../factories/repositories";
import { PipelinesCodeStarSource } from "./code-star-source";
import { EcrStep } from "./ecr-step";
export interface EcrStackProps extends StackProps {
    readonly repositories: Repositories;
    readonly source: PipelinesCodeStarSource;
}
export declare class EcrStack extends Stack {
    readonly props: EcrStackProps;
    readonly steps: EcrStep[];
    constructor(scope: Construct, id: string, props: EcrStackProps);
    protected createEcrSteps(): EcrStep[];
}
