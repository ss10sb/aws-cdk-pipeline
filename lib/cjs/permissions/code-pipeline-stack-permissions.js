"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineStackPermissions = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const core_1 = require("@aws-cdk/core");
const permissions_1 = require("../factories/permissions");
class CodePipelineStackPermissions extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }
    handlePermissions() {
        this.synth();
        this.environments();
        this.ecrSteps();
    }
    ecrSteps() {
        permissions_1.Permissions.granteeCanPushPullFromRepositories(this.props.ecrSteps.role, this.props.repositories);
    }
    environments() {
        this.accountsCanDescribeEcr();
        this.accountsCanPullFromEcr();
    }
    accountsCanDescribeEcr() {
        let accountIds = [
            core_1.Stack.of(this.scope).account
        ];
        permissions_1.Permissions.accountIdsCanDescribeEcr(accountIds, this.props.repositories);
    }
    accountsCanPullFromEcr() {
        let accountIds = [];
        for (const envConfig of this.props.environments) {
            if (envConfig.AWSAccountId) {
                accountIds.push(envConfig.AWSAccountId);
            }
        }
        if (accountIds && accountIds.length > 0) {
            permissions_1.Permissions.accountIdsCanPullFromEcr(accountIds, this.props.repositories);
        }
    }
    synth() {
        const grantee = this.props.synth.role;
        permissions_1.Permissions.granteeCanReadParam(grantee, this.props.configParam);
        permissions_1.Permissions.granteeCanDescribeRepositories(grantee, this.props.repositories);
        this.addCdkRoleToPrincipal(grantee, 'lookup');
    }
    addCdkRoleToPrincipal(grantee, role = 'lookup') {
        grantee.addToPrincipalPolicy(permissions_1.Permissions.policyStatementForBootstrapRole(role));
    }
}
exports.CodePipelineStackPermissions = CodePipelineStackPermissions;
//# sourceMappingURL=code-pipeline-stack-permissions.js.map