/**
 * Borrowed from seeebiii/ses-verify-identies
 * needed to override some of the private methods so here it is...
 */
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Topic } from '@aws-cdk/aws-sns';
import { Construct } from '@aws-cdk/core';
import { AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';
export declare function generateSesPolicyForCustomResource(...methods: string[]): AwsCustomResourcePolicy;
export declare type NotificationType = 'Bounce' | 'Complaint' | 'Delivery';
export interface IVerifySesDomainProps {
    /**
     * A domain name to be used for the SES domain identity, e.g. 'sub-domain.example.org'
     */
    readonly domainName: string;
    /**
     * A hostedZone name to be matched with Route 53 record. e.g. 'example.org'
     * @default same as domainName
     */
    readonly hostedZoneName?: string;
    /**
     * Whether to automatically add a TXT record to the hosed zone of your domain. This only works if your domain is managed by Route53. Otherwise disable it.
     * @default true
     */
    readonly addTxtRecord?: boolean;
    /**
     * Whether to automatically add a MX record to the hosted zone of your domain. This only works if your domain is managed by Route53. Otherwise disable it.
     * @default true
     */
    readonly addMxRecord?: boolean;
    /**
     * Whether to automatically add DKIM records to the hosted zone of your domain. This only works if your domain is managed by Route53. Otherwise disable it.
     * @default true
     */
    readonly addDkimRecords?: boolean;
    /**
     * An SNS topic where bounces, complaints or delivery notifications can be sent to. If none is provided, a new topic will be created and used for all different notification types.
     * @default new topic will be created
     */
    readonly notificationTopic?: Topic;
    /**
     * Select for which notification types you want to configure a topic.
     * @default [Bounce, Complaint]
     */
    readonly notificationTypes?: NotificationType[];
}
/**
 * A construct to verify a SES domain identity. It initiates a domain verification and can automatically create appropriate records in Route53 to verify the domain. Also, it's possible to attach a notification topic for bounces, complaints or delivery notifications.
 *
 * @example
 *
 * new VerifySesDomain(this, 'SesDomainVerification', {
 *   domainName: 'example.org'
 * });
 *
 */
export declare class VerifySesDomain extends Construct {
    constructor(parent: Construct, name: string, props: IVerifySesDomainProps);
    private verifyDomainIdentity;
    getHostedZone(domainName: string): IHostedZone;
    private createTxtRecordLinkingToSes;
    private createMxRecord;
    private initDkimVerification;
    private addDkimRecords;
    private createTopicOrUseExisting;
    private addTopicToDomainIdentity;
    private addSesNotificationTopicForIdentity;
}
