import { DetailType, INotificationRuleSource, INotificationRuleTarget } from "@aws-cdk/aws-codestarnotifications";
import { PipelineNotificationEvents } from "@aws-cdk/aws-codepipeline";
export declare enum NotificationRuleEvents {
    PIPELINE_ACTION_EXECUTION_SUCCEEDED = "codepipeline-pipeline-action-execution-succeeded",
    PIPELINE_ACTION_EXECUTION_FAILED = "codepipeline-pipeline-action-execution-failed",
    PIPELINE_ACTION_EXECUTION_CANCELED = "codepipeline-pipeline-action-execution-canceled",
    PIPELINE_ACTION_EXECUTION_STARTED = "codepipeline-pipeline-action-execution-started",
    PIPELINE_STAGE_EXECUTION_SUCCEEDED = "codepipeline-pipeline-stage-execution-succeeded",
    PIPELINE_STAGE_EXECUTION_FAILED = "codepipeline-pipeline-stage-execution-failed",
    PIPELINE_STAGE_EXECUTION_CANCELED = "codepipeline-pipeline-stage-execution-canceled",
    PIPELINE_STAGE_EXECUTION_STARTED = "codepipeline-pipeline-stage-execution-started",
    PIPELINE_STAGE_EXECUTION_RESUMED = "codepipeline-pipeline-stage-execution-resumed",
    PIPELINE_PIPELINE_EXECUTION_SUCCEEDED = "codepipeline-pipeline-pipeline-execution-succeeded",
    PIPELINE_PIPELINE_EXECUTION_FAILED = "codepipeline-pipeline-pipeline-execution-failed",
    PIPELINE_PIPELINE_EXECUTION_CANCELED = "codepipeline-pipeline-pipeline-execution-canceled",
    PIPELINE_PIPELINE_EXECUTION_STARTED = "codepipeline-pipeline-pipeline-execution-started",
    PIPELINE_PIPELINE_EXECUTION_RESUMED = "codepipeline-pipeline-pipeline-execution-resumed",
    PIPELINE_MANUAL_APPROVAL_SUCCEEDED = "codepipeline-pipeline-manual-approval-succeeded",
    PIPELINE_MANUAL_APPROVAL_FAILED = "codepipeline-pipeline-manual-approval-failed",
    PIPELINE_MANUAL_APPROVAL_NEEDED = "codepipeline-pipeline-manual-approval-needed"
}
export interface NotificationRuleConfig {
    detailType?: DetailType;
    events: PipelineNotificationEvents[];
    targets?: INotificationRuleTarget[];
    emails?: string[];
}
export interface NotificationTargetProps extends NotificationRuleConfig {
}
export interface NotificationRuleProps extends NotificationTargetProps {
    source: INotificationRuleSource;
}
export declare class Notifications {
    getMappedPipelineNotificationEvents(events: NotificationRuleEvents[]): PipelineNotificationEvents[];
    getEventMap(): {
        [key in NotificationRuleEvents]: string;
    };
}
