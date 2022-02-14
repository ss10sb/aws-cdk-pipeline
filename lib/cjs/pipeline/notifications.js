"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = exports.NotificationRuleEvents = void 0;
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
var NotificationRuleEvents;
(function (NotificationRuleEvents) {
    NotificationRuleEvents["PIPELINE_ACTION_EXECUTION_SUCCEEDED"] = "codepipeline-pipeline-action-execution-succeeded";
    NotificationRuleEvents["PIPELINE_ACTION_EXECUTION_FAILED"] = "codepipeline-pipeline-action-execution-failed";
    NotificationRuleEvents["PIPELINE_ACTION_EXECUTION_CANCELED"] = "codepipeline-pipeline-action-execution-canceled";
    NotificationRuleEvents["PIPELINE_ACTION_EXECUTION_STARTED"] = "codepipeline-pipeline-action-execution-started";
    NotificationRuleEvents["PIPELINE_STAGE_EXECUTION_SUCCEEDED"] = "codepipeline-pipeline-stage-execution-succeeded";
    NotificationRuleEvents["PIPELINE_STAGE_EXECUTION_FAILED"] = "codepipeline-pipeline-stage-execution-failed";
    NotificationRuleEvents["PIPELINE_STAGE_EXECUTION_CANCELED"] = "codepipeline-pipeline-stage-execution-canceled";
    NotificationRuleEvents["PIPELINE_STAGE_EXECUTION_STARTED"] = "codepipeline-pipeline-stage-execution-started";
    NotificationRuleEvents["PIPELINE_STAGE_EXECUTION_RESUMED"] = "codepipeline-pipeline-stage-execution-resumed";
    NotificationRuleEvents["PIPELINE_PIPELINE_EXECUTION_SUCCEEDED"] = "codepipeline-pipeline-pipeline-execution-succeeded";
    NotificationRuleEvents["PIPELINE_PIPELINE_EXECUTION_FAILED"] = "codepipeline-pipeline-pipeline-execution-failed";
    NotificationRuleEvents["PIPELINE_PIPELINE_EXECUTION_CANCELED"] = "codepipeline-pipeline-pipeline-execution-canceled";
    NotificationRuleEvents["PIPELINE_PIPELINE_EXECUTION_STARTED"] = "codepipeline-pipeline-pipeline-execution-started";
    NotificationRuleEvents["PIPELINE_PIPELINE_EXECUTION_RESUMED"] = "codepipeline-pipeline-pipeline-execution-resumed";
    NotificationRuleEvents["PIPELINE_MANUAL_APPROVAL_SUCCEEDED"] = "codepipeline-pipeline-manual-approval-succeeded";
    NotificationRuleEvents["PIPELINE_MANUAL_APPROVAL_FAILED"] = "codepipeline-pipeline-manual-approval-failed";
    NotificationRuleEvents["PIPELINE_MANUAL_APPROVAL_NEEDED"] = "codepipeline-pipeline-manual-approval-needed";
})(NotificationRuleEvents = exports.NotificationRuleEvents || (exports.NotificationRuleEvents = {}));
class Notifications {
    getMappedPipelineNotificationEvents(events) {
        let mapped = [];
        for (const event of events) {
            const val = this.getEventMap()[event];
            if (val) {
                mapped.push(val);
            }
        }
        return mapped;
    }
    getEventMap() {
        return {
            [NotificationRuleEvents.PIPELINE_ACTION_EXECUTION_CANCELED]: aws_codepipeline_1.PipelineNotificationEvents.ACTION_EXECUTION_CANCELED,
            [NotificationRuleEvents.PIPELINE_ACTION_EXECUTION_FAILED]: aws_codepipeline_1.PipelineNotificationEvents.ACTION_EXECUTION_FAILED,
            [NotificationRuleEvents.PIPELINE_ACTION_EXECUTION_STARTED]: aws_codepipeline_1.PipelineNotificationEvents.ACTION_EXECUTION_STARTED,
            [NotificationRuleEvents.PIPELINE_ACTION_EXECUTION_SUCCEEDED]: aws_codepipeline_1.PipelineNotificationEvents.ACTION_EXECUTION_SUCCEEDED,
            [NotificationRuleEvents.PIPELINE_MANUAL_APPROVAL_NEEDED]: aws_codepipeline_1.PipelineNotificationEvents.MANUAL_APPROVAL_NEEDED,
            [NotificationRuleEvents.PIPELINE_MANUAL_APPROVAL_FAILED]: aws_codepipeline_1.PipelineNotificationEvents.MANUAL_APPROVAL_FAILED,
            [NotificationRuleEvents.PIPELINE_MANUAL_APPROVAL_SUCCEEDED]: aws_codepipeline_1.PipelineNotificationEvents.MANUAL_APPROVAL_SUCCEEDED,
            [NotificationRuleEvents.PIPELINE_PIPELINE_EXECUTION_CANCELED]: aws_codepipeline_1.PipelineNotificationEvents.PIPELINE_EXECUTION_CANCELED,
            [NotificationRuleEvents.PIPELINE_PIPELINE_EXECUTION_FAILED]: aws_codepipeline_1.PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
            [NotificationRuleEvents.PIPELINE_PIPELINE_EXECUTION_RESUMED]: aws_codepipeline_1.PipelineNotificationEvents.PIPELINE_EXECUTION_RESUMED,
            [NotificationRuleEvents.PIPELINE_PIPELINE_EXECUTION_STARTED]: aws_codepipeline_1.PipelineNotificationEvents.PIPELINE_EXECUTION_STARTED,
            [NotificationRuleEvents.PIPELINE_PIPELINE_EXECUTION_SUCCEEDED]: aws_codepipeline_1.PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
            [NotificationRuleEvents.PIPELINE_STAGE_EXECUTION_CANCELED]: aws_codepipeline_1.PipelineNotificationEvents.STAGE_EXECUTION_CANCELED,
            [NotificationRuleEvents.PIPELINE_STAGE_EXECUTION_FAILED]: aws_codepipeline_1.PipelineNotificationEvents.STAGE_EXECUTION_FAILED,
            [NotificationRuleEvents.PIPELINE_STAGE_EXECUTION_RESUMED]: aws_codepipeline_1.PipelineNotificationEvents.STAGE_EXECUTION_RESUMED,
            [NotificationRuleEvents.PIPELINE_STAGE_EXECUTION_STARTED]: aws_codepipeline_1.PipelineNotificationEvents.STAGE_EXECUTION_STARTED,
            [NotificationRuleEvents.PIPELINE_STAGE_EXECUTION_SUCCEEDED]: aws_codepipeline_1.PipelineNotificationEvents.STAGE_EXECUTION_SUCCEEDED,
        };
    }
}
exports.Notifications = Notifications;
//# sourceMappingURL=notifications.js.map