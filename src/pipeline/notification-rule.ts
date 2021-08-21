import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {
    DetailType,
    INotificationRuleSource,
    INotificationRuleTarget,
    NotificationRule as NotificationRuleAws
} from "@aws-cdk/aws-codestarnotifications";
import {Topic} from "@aws-cdk/aws-sns";
import {EmailSubscription} from "@aws-cdk/aws-sns-subscriptions";

export enum NotificationRuleEvents {
    PIPELINE_ACTION_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-action-execution-succeeded',
    PIPELINE_ACTION_EXECUTION_FAILED = 'codepipeline-pipeline-action-execution-failed',
    PIPELINE_ACTION_EXECUTION_CANCELED = 'codepipeline-pipeline-action-execution-canceled',
    PIPELINE_ACTION_EXECUTION_STARTED = 'codepipeline-pipeline-action-execution-started',
    PIPELINE_STAGE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-stage-execution-succeeded',
    PIPELINE_STAGE_EXECUTION_FAILED = 'codepipeline-pipeline-stage-execution-failed',
    PIPELINE_STAGE_EXECUTION_CANCELED = 'codepipeline-pipeline-stage-execution-canceled',
    PIPELINE_STAGE_EXECUTION_STARTED = 'codepipeline-pipeline-stage-execution-started',
    PIPELINE_STAGE_EXECUTION_RESUMED = 'codepipeline-pipeline-stage-execution-resumed',
    PIPELINE_PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded',
    PIPELINE_PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed',
    PIPELINE_PIPELINE_EXECUTION_CANCELED = 'codepipeline-pipeline-pipeline-execution-canceled',
    PIPELINE_PIPELINE_EXECUTION_STARTED = 'codepipeline-pipeline-pipeline-execution-started',
    PIPELINE_PIPELINE_EXECUTION_RESUMED = 'codepipeline-pipeline-pipeline-execution-resumed',
    PIPELINE_MANUAL_APPROVAL_SUCCEEDED = 'codepipeline-pipeline-manual-approval-succeeded',
    PIPELINE_MANUAL_APPROVAL_FAILED = 'codepipeline-pipeline-manual-approval-failed',
    PIPELINE_MANUAL_APPROVAL_NEEDED = 'codepipeline-pipeline-manual-approval-needed',
}

export interface NotificationRuleConfig {
    detailType?: DetailType;
    events: NotificationRuleEvents[];
    emails?: string[];
}

export interface NotificationRuleProps extends NotificationRuleConfig {
    targets?: INotificationRuleTarget[];
    source: INotificationRuleSource;
}

export class NotificationRule extends NonConstruct {
    readonly props: NotificationRuleProps;
    readonly targets: INotificationRuleTarget[];
    readonly notificationRule: NotificationRuleAws;

    constructor(scope: Construct, id: string, props: NotificationRuleProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.notificationRule = this.createNotificationRule();
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

    protected createNotificationRule(): NotificationRuleAws {
        return new NotificationRuleAws(this.scope, this.mixNameWithId('notification-rule'), {
            source: this.props.source,
            events: this.props.events,
            detailType: this.props.detailType ?? undefined,
            targets: this.targets
        });
    }
}
