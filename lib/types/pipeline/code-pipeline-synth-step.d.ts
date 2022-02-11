import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { CodeBuildStep, CodePipelineSource, IFileSetProducer } from "@aws-cdk/pipelines";
import { Role } from "@aws-cdk/aws-iam";
export interface CodePipelineSynthStepProps {
    source: CodePipelineSource;
}
export declare class CodePipelineSynthStep extends NonConstruct {
    readonly synth: IFileSetProducer | CodeBuildStep;
    readonly props: CodePipelineSynthStepProps;
    readonly role: Role;
    constructor(scope: Construct, id: string, props: CodePipelineSynthStepProps);
    protected createSynth(): IFileSetProducer | CodeBuildStep;
    protected getCommands(): string[];
    protected getCopyCommand(): string;
}
