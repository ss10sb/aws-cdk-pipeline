import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep, CodePipelineSource, IFileSetProducer } from "@aws-cdk/pipelines";
import { Role } from "@aws-cdk/aws-iam";
export interface SynthStepProps {
    source: CodePipelineSource;
}
export declare class SynthStep extends NonConstruct {
    readonly synth: IFileSetProducer | CodeBuildStep;
    readonly props: SynthStepProps;
    readonly role: Role;
    constructor(scope: Construct, id: string, props: SynthStepProps);
    protected createSynth(): IFileSetProducer | CodeBuildStep;
    protected getCommands(): string[];
    protected getCopyCommand(): string;
}
