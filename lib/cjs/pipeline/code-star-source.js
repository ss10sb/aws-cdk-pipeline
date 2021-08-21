"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeStarSource = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const pipelines_1 = require("@aws-cdk/pipelines");
class CodeStarSource extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.source = this.createCodeStarSource();
    }
    createCodeStarSource() {
        return pipelines_1.CodePipelineSource.connection(this.getRepo(), this.getBranch(), {
            connectionArn: this.props.connectionArn
        });
    }
    getBranch() {
        var _a;
        return (_a = this.props.branch) !== null && _a !== void 0 ? _a : 'main';
    }
    getRepo() {
        return [...[this.props.owner], ...[this.props.repo]].join('/');
    }
}
exports.CodeStarSource = CodeStarSource;
//# sourceMappingURL=code-star-source.js.map