import {NonConstruct} from "@smorken/cdk-utils";
import {INotificationRuleTarget} from "@aws-cdk/aws-codestarnotifications";
import {Construct} from "@aws-cdk/core";
import {Topic} from "@aws-cdk/aws-sns";
import {EmailSubscription} from "@aws-cdk/aws-sns-subscriptions";
import {NotificationTargetProps} from "./notifications";

export class NotificationTargets extends NonConstruct {

    readonly props: NotificationTargetProps;
    readonly targets: INotificationRuleTarget[];

    constructor(scope: Construct, id: string, props: NotificationTargetProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        if (this.props.emails && this.props.emails.length > 0) {
            this.addEmails(this.props.emails);
        }
    }

    public addEmails(emails: string[]): void {
        for (const target of this.targets) {
            if (target instanceof Topic) {
                this.addEmailSubscriptionsToTopic(target, emails);
            }
        }
    }

    protected addEmailSubscriptionsToTopic(topic: Topic, emails: string[]): void {
        for (const email of emails) {
            topic.addSubscription(new EmailSubscription(email));
        }
    }

    protected createTargets(): INotificationRuleTarget[] {
        if (this.props.targets && this.props.targets.length > 0) {
            return this.props.targets;
        }
        return [
            new Topic(this.scope, this.mixNameWithId('notification-rule-topic'))
        ];
    }
}