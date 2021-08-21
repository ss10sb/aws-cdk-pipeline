"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sqs = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_sqs_1 = require("@aws-cdk/aws-sqs");
class Sqs extends cdk_utils_1.NonConstruct {
    constructor(scope, id) {
        super(scope, id);
        this.defaults = {
            queueName: this.mixNameWithId('queue'),
            encryption: aws_sqs_1.QueueEncryption.KMS_MANAGED
        };
    }
    create(props) {
        var _a, _b, _c;
        const queueName = this.getQueueName(props);
        props.queueName = queueName;
        return new aws_sqs_1.Queue(this.scope, queueName, {
            queueName: props.queueName,
            encryption: (_a = props.encryption) !== null && _a !== void 0 ? _a : this.defaults.encryption,
            deadLetterQueue: (_b = props.deadLetterQueue) !== null && _b !== void 0 ? _b : undefined,
            retentionPeriod: (_c = props.retentionPeriod) !== null && _c !== void 0 ? _c : undefined
        });
    }
    getQueueName(props) {
        if (props.queueName) {
            return this.mixNameWithId(props.queueName);
        }
        return this.defaults.queueName;
    }
}
exports.Sqs = Sqs;
//# sourceMappingURL=sqs.js.map