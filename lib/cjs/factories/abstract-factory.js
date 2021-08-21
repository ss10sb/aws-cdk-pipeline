"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFactory = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const naming_1 = require("../naming");
class AbstractFactory extends cdk_utils_1.NonConstruct {
    constructor(scope, id) {
        super(scope, id);
        this.naming = new naming_1.Naming();
    }
}
exports.AbstractFactory = AbstractFactory;
//# sourceMappingURL=abstract-factory.js.map