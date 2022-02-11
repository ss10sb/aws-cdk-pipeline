import { StackConfig } from "../definitions/stack-config";
import { ConfigStack } from "@smorken/cdk-utils";
export declare class CodePipelineStack<T extends StackConfig> extends ConfigStack<T> {
    cachedName?: string;
    exec(): void;
    getName(suffix?: string): string;
    private createEcrWave;
    private createEcrSteps;
    private createEnvironmentStages;
    private createPipeline;
    private createPipelineNotificationRule;
    private createCodeStarSource;
    private createRepositories;
    private getNameFromConfig;
    private createSynthStep;
}
