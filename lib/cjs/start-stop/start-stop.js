"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartStop = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const start_stop_function_1 = require("./start-stop-function");
const start_stop_event_1 = require("./start-stop-event");
class StartStop extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.startStopFunc = this.createStartStopFunction();
    }
    createRules(cluster) {
        this.event = new start_stop_event_1.StartStopEvent(this.scope, this.id, {
            lambdaFunction: this.startStopFunc.function
        });
        this.event.create({
            clusterArn: cluster.clusterArn,
            status: start_stop_event_1.LambdaEventStatus.START,
            schedule: this.props.start
        });
        this.event.create({
            clusterArn: cluster.clusterArn,
            status: start_stop_event_1.LambdaEventStatus.STOP,
            schedule: this.props.stop
        });
        return this.event;
    }
    createStartStopFunction() {
        var _a;
        return new start_stop_function_1.StartStopFunction(this.scope, this.id, (_a = this.props.startStopFunctionProps) !== null && _a !== void 0 ? _a : {});
    }
}
exports.StartStop = StartStop;
//# sourceMappingURL=start-stop.js.map