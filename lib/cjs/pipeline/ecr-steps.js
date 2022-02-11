"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrSteps = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const ecr_step_1 = require("./ecr-step");
class EcrSteps extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.role = new aws_iam_1.Role(this.scope, `${this.scope.node.id}-ecr-step-role`, {
            assumedBy: new aws_iam_1.ServicePrincipal('codebuild.amazonaws.com')
        });
        this.steps = this.createEcrSteps();
    }
    createEcrSteps() {
        let steps = [];
        for (const [name, repo] of this.props.repositories.repoEntries()) {
            const ecrStep = new ecr_step_1.EcrStep(this.scope, `${this.scope.node.id}-${name}-step`, {
                role: this.role,
                source: this.props.source,
                imageTag: this.props.repositories.getTagForImage(name),
                name: name,
                repository: repo
            });
            steps.push(ecrStep.step);
        }
        return steps;
    }
}
exports.EcrSteps = EcrSteps;
//# sourceMappingURL=ecr-steps.js.map