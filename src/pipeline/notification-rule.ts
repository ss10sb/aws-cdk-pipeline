import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {
    INotificationRule,
    INotificationRuleTarget,
    NotificationRule as NotificationRuleAws
} from "@aws-cdk/aws-codestarnotifications";
import {NotificationTargets} from "./notification-targets";
import {NotificationRuleProps} from "./notifications";

export class NotificationRule extends NonConstruct {
    readonly props: NotificationRuleProps;
    readonly targets: INotificationRuleTarget[];
    readonly notificationRule: INotificationRule;

    constructor(scope: Construct, id: string, props: NotificationRuleProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.notificationRule = this.createNotificationRule();
    }

    protected createTargets(): INotificationRuleTarget[] {
        const notificationTargets = new NotificationTargets(this.scope, this.id, this.props);
        return notificationTargets.targets;
    }

    protected createNotificationRule(): INotificationRule {
        return new NotificationRuleAws(this.scope, this.mixNameWithId('notification-rule'), {
            source: this.props.source,
            events: this.props.events,
            detailType: this.props.detailType ?? undefined,
            targets: this.targets
        });
    }
}
