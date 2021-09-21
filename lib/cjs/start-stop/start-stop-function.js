"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartStopFunction = void 0;
const tslib_1 = require("tslib");
const cdk_utils_1 = require("@smorken/cdk-utils");
const aws_lambda_nodejs_1 = require("@aws-cdk/aws-lambda-nodejs");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const path = (0, tslib_1.__importStar)(require("path"));
class StartStopFunction extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            memorySize: 128,
            timeout: 5,
            runtime: aws_lambda_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            entry: path.join(__dirname, '/lambda/index.js')
        };
        this.function = this.create();
    }
    create() {
        var _a, _b, _c, _d, _e;
        return new aws_lambda_nodejs_1.NodejsFunction(this.scope, this.mixNameWithId('start-stop-lambda'), {
            memorySize: (_a = this.props.memorySize) !== null && _a !== void 0 ? _a : this.defaults.memorySize,
            timeout: core_1.Duration.seconds((_b = this.props.timeout) !== null && _b !== void 0 ? _b : this.defaults.timeout),
            runtime: (_c = this.props.runtime) !== null && _c !== void 0 ? _c : this.defaults.runtime,
            handler: (_d = this.props.handler) !== null && _d !== void 0 ? _d : this.defaults.handler,
            entry: (_e = this.props.entry) !== null && _e !== void 0 ? _e : this.defaults.entry
        });
    }
}
exports.StartStopFunction = StartStopFunction;
//# sourceMappingURL=start-stop-function.js.map