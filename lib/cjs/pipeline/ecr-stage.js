"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrStage = void 0;
const core_1 = require("@aws-cdk/core");
const ecr_stack_1 = require("./ecr-stack");
class EcrStage extends core_1.Stage {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.props = props;
        this.stack = new ecr_stack_1.EcrStack(this, `stack`, {
            source: this.props.source,
            repositories: this.props.repositories
        });
    }
}
exports.EcrStage = EcrStage;
//# sourceMappingURL=ecr-stage.js.map