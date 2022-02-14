"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTargets = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_sns_1 = require("@aws-cdk/aws-sns");
const aws_sns_subscriptions_1 = require("@aws-cdk/aws-sns-subscriptions");
class NotificationTargets extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
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
}
exports.NotificationTargets = NotificationTargets;
//# sourceMappingURL=notification-targets.js.map