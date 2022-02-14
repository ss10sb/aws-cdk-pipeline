"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRule = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_codestarnotifications_1 = require("@aws-cdk/aws-codestarnotifications");
const notification_targets_1 = require("./notification-targets");
class NotificationRule extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.notificationRule = this.createNotificationRule();
    }
    createTargets() {
        const notificationTargets = new notification_targets_1.NotificationTargets(this.scope, this.id, this.props);
        return notificationTargets.targets;
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