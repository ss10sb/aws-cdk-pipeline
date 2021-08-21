"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDefinitionFactory = void 0;
const core_1 = require("@aws-cdk/core");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const abstract_factory_1 = require("./abstract-factory");
class TaskDefinitionFactory extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.defaults = {
            compatibility: aws_ecs_1.Compatibility.FARGATE,
            networkMode: aws_ecs_1.NetworkMode.AWS_VPC
        };
    }
    create(type, props) {
        var _a, _b;
        const name = this.naming.next(this.mixNameWithId(`task-def-${type}`));
        const td = new aws_ecs_1.TaskDefinition(this.scope, name, {
            family: name,
            compatibility: (_a = props.compatibility) !== null && _a !== void 0 ? _a : this.defaults.compatibility,
            cpu: props.cpu,
            memoryMiB: props.memoryMiB,
            networkMode: (_b = props.networkMode) !== null && _b !== void 0 ? _b : this.defaults.networkMode,
            executionRole: new aws_iam_1.Role(this.scope, `${name}-exec-role`, {
                assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
                roleName: core_1.PhysicalName.GENERATE_IF_NEEDED
            })
        });
        this.getContainerFactory().create(type, td, props.containers);
        return td;
    }
    getContainerFactory() {
        return this.props.containerFactory;
    }
}
exports.TaskDefinitionFactory = TaskDefinitionFactory;
//# sourceMappingURL=task-definition-factory.js.map