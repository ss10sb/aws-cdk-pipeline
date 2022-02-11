"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineSynthStep = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const pipelines_1 = require("@aws-cdk/pipelines");
const aws_iam_1 = require("@aws-cdk/aws-iam");
class CodePipelineSynthStep extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.role = new aws_iam_1.Role(this.scope, this.mixNameWithId('synth-step-role'), {
            assumedBy: new aws_iam_1.ServicePrincipal('codebuild.amazonaws.com')
        });
        this.synth = this.createSynth();
    }
    createSynth() {
        return new pipelines_1.CodeBuildStep(this.mixNameWithId('synth-step'), {
            input: this.props.source,
            commands: this.getCommands(),
            role: this.role
        });
    }
    getCommands() {
        return [
            this.getCopyCommand(),
            'npm ci',
            'npm run build',
            'npx cdk synth',
        ];
    }
    getCopyCommand() {
        const files = ['_common.js', 'defaults.js'];
        let parts = [];
        for (const file of files) {
            parts.push(`cp config/${file}.copy config/${file}`);
        }
        return parts.join(' && ');
    }
}
exports.CodePipelineSynthStep = CodePipelineSynthStep;
//# sourceMappingURL=code-pipeline-synth-step.js.map