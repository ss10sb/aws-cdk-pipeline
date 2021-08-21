"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifySesDomain = exports.generateSesPolicyForCustomResource = void 0;
/**
 * Borrowed from seeebiii/ses-verify-identies
 * needed to override some of the private methods so here it is...
 */
const aws_route53_1 = require("@aws-cdk/aws-route53");
const aws_sns_1 = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const cx_api_1 = require("@aws-cdk/cx-api");
const aws_iam_1 = require("@aws-cdk/aws-iam");
function generateSesPolicyForCustomResource(...methods) {
    // for some reason the default policy is generated as `email:<method>` which does not work -> hence we need to provide our own
    return custom_resources_1.AwsCustomResourcePolicy.fromStatements([
        new aws_iam_1.PolicyStatement({
            actions: methods.map((method) => 'ses:' + method),
            effect: aws_iam_1.Effect.ALLOW,
            // PolicySim says ses:SetActiveReceiptRuleSet does not allow specifying a resource, hence use '*'
            resources: ['*'],
        }),
    ]);
}
exports.generateSesPolicyForCustomResource = generateSesPolicyForCustomResource;
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
class VerifySesDomain extends core_1.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const domainName = props.domainName;
        const verifyDomainIdentity = this.verifyDomainIdentity(domainName);
        if (props.notificationTypes && props.notificationTypes.length > 0) {
            const topic = this.createTopicOrUseExisting(domainName, verifyDomainIdentity, props.notificationTopic);
            this.addTopicToDomainIdentity(domainName, topic, props.notificationTypes);
        }
        const hostedZoneName = props.hostedZoneName ? props.hostedZoneName : domainName;
        const zone = this.getHostedZone(hostedZoneName);
        if (isTrueOrUndefined(props.addTxtRecord)) {
            const txtRecord = this.createTxtRecordLinkingToSes(zone, domainName, verifyDomainIdentity);
            txtRecord.node.addDependency(verifyDomainIdentity);
        }
        if (isTrueOrUndefined(props.addMxRecord)) {
            const mxRecord = this.createMxRecord(zone, domainName);
            mxRecord.node.addDependency(verifyDomainIdentity);
        }
        if (isTrueOrUndefined(props.addDkimRecords)) {
            const verifyDomainDkim = this.initDkimVerification(domainName);
            verifyDomainDkim.node.addDependency(verifyDomainIdentity);
            this.addDkimRecords(verifyDomainDkim, zone, domainName);
        }
    }
    verifyDomainIdentity(domainName) {
        return new custom_resources_1.AwsCustomResource(this, 'VerifyDomainIdentity', {
            onCreate: {
                service: 'SES',
                action: 'verifyDomainIdentity',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('VerificationToken'),
            },
            onUpdate: {
                service: 'SES',
                action: 'verifyDomainIdentity',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: custom_resources_1.PhysicalResourceId.fromResponse('VerificationToken'),
            },
            onDelete: {
                service: 'SES',
                action: 'deleteIdentity',
                parameters: {
                    Identity: domainName,
                },
            },
            policy: generateSesPolicyForCustomResource('VerifyDomainIdentity', 'DeleteIdentity'),
        });
    }
    getHostedZone(domainName) {
        return aws_route53_1.HostedZone.fromLookup(this, 'Zone', {
            domainName: domainName,
        });
    }
    createTxtRecordLinkingToSes(zone, domainName, verifyDomainIdentity) {
        return new aws_route53_1.TxtRecord(this, 'SesVerificationRecord', {
            zone,
            recordName: `_amazonses.${domainName}`,
            values: [verifyDomainIdentity.getResponseField('VerificationToken')],
        });
    }
    createMxRecord(zone, domainName) {
        return new aws_route53_1.MxRecord(this, 'SesMxRecord', {
            zone,
            recordName: domainName,
            values: [
                {
                    hostName: core_1.Fn.sub(`inbound-smtp.${cx_api_1.EnvironmentPlaceholders.CURRENT_REGION}.amazonaws.com`),
                    priority: 10,
                },
            ],
        });
    }
    initDkimVerification(domainName) {
        return new custom_resources_1.AwsCustomResource(this, 'VerifyDomainDkim', {
            onCreate: {
                service: 'SES',
                action: 'verifyDomainDkim',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(domainName + '-verify-domain-dkim'),
            },
            onUpdate: {
                service: 'SES',
                action: 'verifyDomainDkim',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(domainName + '-verify-domain-dkim'),
            },
            policy: generateSesPolicyForCustomResource('VerifyDomainDkim'),
        });
    }
    addDkimRecords(verifyDomainDkim, zone, domainName) {
        [0, 1, 2].forEach((val) => {
            const dkimToken = verifyDomainDkim.getResponseField(`DkimTokens.${val}`);
            const cnameRecord = new aws_route53_1.CnameRecord(this, 'SesDkimVerificationRecord' + val, {
                zone,
                recordName: `${dkimToken}._domainkey.${domainName}`,
                domainName: `${dkimToken}.dkim.amazonses.com`,
            });
            cnameRecord.node.addDependency(verifyDomainDkim);
        });
    }
    createTopicOrUseExisting(domainName, verifyDomainIdentity, existingTopic) {
        const topic = existingTopic !== null && existingTopic !== void 0 ? existingTopic : new aws_sns_1.Topic(this, 'SesNotificationTopic');
        new core_1.CfnOutput(this, domainName + 'SesNotificationTopic', {
            value: topic.topicArn,
            description: 'SES notification topic for ' + domainName,
        });
        topic.node.addDependency(verifyDomainIdentity);
        return topic;
    }
    addTopicToDomainIdentity(domainName, topic, notificationTypes) {
        notificationTypes.forEach((type) => {
            this.addSesNotificationTopicForIdentity(domainName, type, topic);
        });
    }
    addSesNotificationTopicForIdentity(identity, notificationType, notificationTopic) {
        const addTopic = new custom_resources_1.AwsCustomResource(this, `Add${notificationType}Topic-${identity}`, {
            onCreate: {
                service: 'SES',
                action: 'setIdentityNotificationTopic',
                parameters: {
                    Identity: identity,
                    NotificationType: notificationType,
                    SnsTopic: notificationTopic.topicArn,
                },
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(`${identity}-set-${notificationType}-topic`),
            },
            policy: generateSesPolicyForCustomResource('SetIdentityNotificationTopic'),
        });
        addTopic.node.addDependency(notificationTopic);
    }
}
exports.VerifySesDomain = VerifySesDomain;
function isTrueOrUndefined(prop) {
    return prop === undefined || prop;
}
//# sourceMappingURL=verify-ses-domain.js.map