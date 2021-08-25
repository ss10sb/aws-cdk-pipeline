"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3 = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const core_1 = require("@aws-cdk/core");
const aws_s3_1 = require("@aws-cdk/aws-s3");
class S3 extends cdk_utils_1.NonConstruct {
    constructor(scope, id) {
        super(scope, id);
        this.defaults = {
            autoDeleteObjects: false,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: core_1.RemovalPolicy.RETAIN,
            enforceSSL: true,
            encryption: aws_s3_1.BucketEncryption.KMS_MANAGED
        };
    }
    create(name, props) {
        var _a, _b, _c, _d, _e, _f;
        const bucketName = this.mixNameWithId(name);
        return new aws_s3_1.Bucket(this.scope, bucketName, {
            bucketName: bucketName,
            blockPublicAccess: (_a = props.blockPublicAccess) !== null && _a !== void 0 ? _a : this.defaults.blockPublicAccess,
            removalPolicy: (_b = props.removalPolicy) !== null && _b !== void 0 ? _b : this.defaults.removalPolicy,
            autoDeleteObjects: (_c = props.autoDeleteObjects) !== null && _c !== void 0 ? _c : this.defaults.autoDeleteObjects,
            encryption: (_d = props.encryption) !== null && _d !== void 0 ? _d : this.defaults.encryption,
            encryptionKey: (_e = props.encryptionKey) !== null && _e !== void 0 ? _e : undefined,
            enforceSSL: this.defaults.enforceSSL,
            bucketKeyEnabled: (_f = props.bucketKeyEnabled) !== null && _f !== void 0 ? _f : undefined
        });
    }
}
exports.S3 = S3;
//# sourceMappingURL=s3.js.map