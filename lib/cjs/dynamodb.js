"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamodb = void 0;
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const core_1 = require("@aws-cdk/core");
const cdk_utils_1 = require("@smorken/cdk-utils");
class Dynamodb extends cdk_utils_1.NonConstruct {
    constructor(scope, id) {
        super(scope, id);
        this.defaults = {
            partitionKey: { name: 'key', type: aws_dynamodb_1.AttributeType.STRING },
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
            encryption: aws_dynamodb_1.TableEncryption.AWS_MANAGED
        };
    }
    create(name, props) {
        var _a, _b, _c;
        const tableName = this.mixNameWithId(name);
        return new aws_dynamodb_1.Table(this.scope, tableName, {
            tableName: tableName,
            partitionKey: (_a = props.partitionKey) !== null && _a !== void 0 ? _a : this.defaults.partitionKey,
            billingMode: (_b = props.billingMode) !== null && _b !== void 0 ? _b : this.defaults.billingMode,
            encryption: (_c = props.encryption) !== null && _c !== void 0 ? _c : this.defaults.encryption,
            removalPolicy: core_1.RemovalPolicy.DESTROY
        });
    }
}
exports.Dynamodb = Dynamodb;
//# sourceMappingURL=dynamodb.js.map