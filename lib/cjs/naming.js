"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Naming = void 0;
class Naming {
    constructor() {
        this.names = {};
    }
    next(name) {
        if (this.names[name] === undefined) {
            this.names[name] = 0;
        }
        else {
            this.names[name]++;
        }
        return `${name}-${this.names[name]}`;
    }
}
exports.Naming = Naming;
//# sourceMappingURL=naming.js.map