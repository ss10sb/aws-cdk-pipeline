"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrStack = void 0;
const core_1 = require("@aws-cdk/core");
const ecr_step_1 = require("./ecr-step");
class EcrStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.props = props;
        this.steps = this.createEcrSteps();
    }
    createEcrSteps() {
        let steps = [];
        for (const [name, repo] of this.props.repositories.repoEntries()) {
            steps.push(new ecr_step_1.EcrStep(this, `${this.node.id}-${name}-ecr-step`, {
                source: this.props.source,
                imageTag: this.props.repositories.getTagForImage(name),
                name: name,
                repository: repo
            }));
        }
        return steps;
    }
}
exports.EcrStack = EcrStack;
//# sourceMappingURL=ecr-stack.js.map