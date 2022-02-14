import { NonConstruct } from "@smorken/cdk-utils";
import { INotificationRuleTarget } from "@aws-cdk/aws-codestarnotifications";
import { Construct } from "@aws-cdk/core";
import { Topic } from "@aws-cdk/aws-sns";
import { NotificationTargetProps } from "./notifications";
export declare class NotificationTargets extends NonConstruct {
    readonly props: NotificationTargetProps;
    readonly targets: INotificationRuleTarget[];
    constructor(scope: Construct, id: string, props: NotificationTargetProps);
    addEmails(emails: string[]): void;
    protected addEmailSubscriptionsToTopic(topic: Topic, emails: string[]): void;
    protected createTargets(): INotificationRuleTarget[];
}
