"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvStackPermissions = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const permissions_1 = require("../factories/permissions");
class EnvStackPermissions extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }
    handlePermissions() {
        this.dynamoDbTable();
        this.sqsQueue();
        this.sesEmail();
        this.s3Bucket();
    }
    dynamoDbTable() {
        if (this.props.table) {
            permissions_1.Permissions.tasksServicesCanReadWriteDynamoDb(this.props.tasksServices, this.props.table);
        }
    }
    sesEmail() {
        permissions_1.Permissions.tasksServicesCanSendEmail(this.props.tasksServices);
    }
    sqsQueue() {
        if (this.props.queue) {
            permissions_1.Permissions.tasksServicesCanUseQueue(this.props.tasksServices, this.props.queue);
        }
    }
    s3Bucket() {
        if (this.props.s3) {
            permissions_1.Permissions.tasksServicesCanReadWriteS3(this.props.tasksServices, this.props.s3);
        }
    }
}
exports.EnvStackPermissions = EnvStackPermissions;
//# sourceMappingURL=env-stack-permissions.js.map