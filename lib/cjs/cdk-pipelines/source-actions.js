"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeStarSource = void 0;
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const cdk_utils_1 = require("@smorken/cdk-utils");
class CodeStarSource extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.sourceArtifact = new aws_codepipeline_1.Artifact();
        this.sourceAction = this.createSourceAction(props);
    }
    createSourceAction(props) {
        var _a;
        return new aws_codepipeline_actions_1.CodeStarConnectionsSourceAction({
            actionName: 'codestar-source',
            owner: props.owner,
            repo: props.repo,
            connectionArn: props.connectionArn,
            branch: (_a = props.branch) !== null && _a !== void 0 ? _a : 'main',
            output: this.sourceArtifact
        });
    }
}
exports.CodeStarSource = CodeStarSource;
//# sourceMappingURL=source-actions.js.map