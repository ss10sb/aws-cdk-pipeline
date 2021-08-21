import { Construct, Stack, Stage, StageProps } from "@aws-cdk/core";
import { PipelinesCodeStarSource } from "./code-star-source";
import { Repositories } from "../factories/repositories";
export interface EcrStageProps extends StageProps {
    readonly repositories: Repositories;
    readonly source: PipelinesCodeStarSource;
}
export declare class EcrStage extends Stage {
    readonly props: EcrStageProps;
    readonly stack: Stack;
    constructor(scope: Construct, id: string, props: EcrStageProps);
}
