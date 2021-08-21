"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRule = exports.NotificationRuleEvents = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_codestarnotifications_1 = require("@aws-cdk/aws-codestarnotifications");
const aws_sns_1 = require("@aws-cdk/aws-sns");
const aws_sns_subscriptions_1 = require("@aws-cdk/aws-sns-subscriptions");
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
class NotificationRule extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.notificationRule = this.createNotificationRule();
        if (this.props.emails && this.props.emails.length > 0) {
            this.addEmails(this.props.emails);
        }
    }
    addEmails(emails) {
        for (const target of this.targets) {
            if (target instanceof aws_sns_1.Topic) {
                this.addEmailSubscriptionsToTopic(target, emails);
            }
        }
    }
    addEmailSubscriptionsToTopic(topic, emails) {
        for (const email of emails) {
            topic.addSubscription(new aws_sns_subscriptions_1.EmailSubscription(email));
        }
    }
    createTargets() {
        if (this.props.targets && this.props.targets.length > 0) {
            return this.props.targets;
        }
        return [
            new aws_sns_1.Topic(this.scope, this.mixNameWithId('notification-rule-topic'))
        ];
    }
    createNotificationRule() {
        var _a;
        return new aws_codestarnotifications_1.NotificationRule(this.scope, this.mixNameWithId('notification-rule'), {
            source: this.props.source,
            events: this.props.events,
            detailType: (_a = this.props.detailType) !== null && _a !== void 0 ? _a : undefined,
            targets: this.targets
        });
    }
}
exports.NotificationRule = NotificationRule;
//# sourceMappingURL=notification-rule.js.map