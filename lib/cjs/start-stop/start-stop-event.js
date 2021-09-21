"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartStopEvent = exports.LambdaEventStatus = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_events_1 = require("@aws-cdk/aws-events");
const aws_events_targets_1 = require("@aws-cdk/aws-events-targets");
var LambdaEventStatus;
(function (LambdaEventStatus) {
    LambdaEventStatus["START"] = "start";
    LambdaEventStatus["STOP"] = "stop";
})(LambdaEventStatus = exports.LambdaEventStatus || (exports.LambdaEventStatus = {}));
class StartStopEvent extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.rules = [];
    }
    create(props) {
        const rule = new aws_events_1.Rule(this.scope, this.mixNameWithId(props.status), {
            schedule: aws_events_1.Schedule.expression(props.schedule),
        });
        rule.addTarget(new aws_events_targets_1.LambdaFunction(this.props.lambdaFunction, {
            event: aws_events_1.RuleTargetInput.fromObject({
                cluster: props.clusterArn,
                status: props.status
            })
        }));
        this.rules.push(rule);
        return rule;
    }
}
exports.StartStopEvent = StartStopEvent;
//# sourceMappingURL=start-stop-event.js.map