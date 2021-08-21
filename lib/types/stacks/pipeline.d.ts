import { ConfigStack } from "@smorken/cdk-utils";
import { StackConfig } from "../definitions/stack-config";
export declare class PipelineStack<T extends StackConfig> extends ConfigStack<T> {
    cachedName?: string;
    exec(): void;
    getName(suffix?: string): string;
    private createEcrBuildAction;
    private createEnvironmentStages;
    private createPipeline;
    private createPipelineNotificationRule;
    private createCodeStarSource;
    private createRepositories;
    private getNameFromConfig;
}
