"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineStageSteps = void 0;
const pipelines_1 = require("@aws-cdk/pipelines");
const util_1 = require("aws-cdk/lib/util");
class CodePipelineStageSteps {
    constructor(stageDeployment) {
        this.stageDeployment = stageDeployment;
        this.map = {
            manualApproval: {
                stepClass: pipelines_1.ManualApprovalStep,
                stepProps: {
                    runOrder: 1
                }
            }
        };
    }
    fromEnvConfig(envConfig) {
        var _a;
        this.addSteps((_a = envConfig.Parameters.steps) !== null && _a !== void 0 ? _a : {});
    }
    addSteps(steps) {
        const stageSteps = this.getSteps(steps);
        this.stageDeployment.addPre(...stageSteps);
    }
    getSteps(steps) {
        let stageSteps = [];
        for (const [k, v] of Object.entries(steps)) {
            const step = this.getStep(k, v);
            if (step) {
                stageSteps.push(step);
            }
        }
        return stageSteps;
    }
    getStep(name, props) {
        var _a;
        const mappedObj = this.map[name];
        if (mappedObj) {
            props = this.getStepProps(name, (_a = mappedObj.stepProps) !== null && _a !== void 0 ? _a : {}, props);
            return new mappedObj.stepClass(`${name}-step`, props);
        }
        return null;
    }
    getStepProps(name, defaultProps, props) {
        const baseObj = {};
        return (0, util_1.deepMerge)({
            baseObj,
            defaultProps,
            props
        });
    }
}
exports.CodePipelineStageSteps = CodePipelineStageSteps;
//# sourceMappingURL=code-pipeline-stage-steps.js.map