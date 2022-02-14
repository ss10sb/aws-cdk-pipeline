import { NonConstruct } from "@smorken/cdk-utils";
import { Construct } from "@aws-cdk/core";
import { INotificationRule, INotificationRuleTarget } from "@aws-cdk/aws-codestarnotifications";
import { NotificationRuleProps } from "./notifications";
export declare class NotificationRule extends NonConstruct {
    readonly props: NotificationRuleProps;
    readonly targets: INotificationRuleTarget[];
    readonly notificationRule: INotificationRule;
    constructor(scope: Construct, id: string, props: NotificationRuleProps);
    protected createTargets(): INotificationRuleTarget[];
    protected createNotificationRule(): INotificationRule;
}
