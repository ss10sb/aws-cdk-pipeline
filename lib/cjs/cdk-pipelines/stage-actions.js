"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageActions = void 0;
const aws_codepipeline_actions_1 = require("@aws-cdk/aws-codepipeline-actions");
const util_1 = require("aws-cdk/lib/util");
class StageActions {
    constructor(stage) {
        this.stage = stage;
        this.map = {
            manualApproval: {
                actionClass: aws_codepipeline_actions_1.ManualApprovalAction,
                actionProps: {
                    runOrder: 1
                }
            }
        };
    }
    fromEnvConfig(envConfig) {
        var _a;
        return this.addActions((_a = envConfig.Parameters.actions) !== null && _a !== void 0 ? _a : {});
    }
    addActions(actions) {
        const stageActions = this.getActions(actions);
        this.stage.addActions(...stageActions);
    }
    getActions(actions) {
        let stageActions = [];
        for (const [k, v] of Object.entries(actions)) {
            const action = this.getAction(k, v);
            if (action) {
                stageActions.push(action);
            }
        }
        return stageActions;
    }
    getAction(name, props) {
        var _a;
        const mappedObj = this.map[name];
        if (mappedObj) {
            props = this.getActionProps(name, (_a = mappedObj.actionProps) !== null && _a !== void 0 ? _a : {}, props);
            return new mappedObj.actionClass(props);
        }
        return null;
    }
    getActionProps(name, defaultProps, props) {
        return (0, util_1.deepMerge)({
            actionName: `${this.stage.node.id}-${name}`,
            runOrder: this.stage.nextSequentialRunOrder()
        }, defaultProps, props);
    }
}
exports.StageActions = StageActions;
//# sourceMappingURL=stage-actions.js.map