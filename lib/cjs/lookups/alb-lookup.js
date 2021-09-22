"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbLookup = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
class AlbLookup {
    static getAlb(scope, config, albArn) {
        return cdk_utils_1.AlbUtils.getAlbByArn(scope, albArn);
    }
    static getAlbArnParamKey(config, name = 'alb01') {
        return `${cdk_utils_1.AlbUtils.getDefaultAlbName(config, name)}-arn`;
    }
    static getAlbArn(scope, config) {
        if (config.Parameters.albArn) {
            return config.Parameters.albArn;
        }
        const arnParamKey = cdk_utils_1.AlbUtils.getAlbArnParamKey(config);
        return cdk_utils_1.AlbUtils.getArnFromParams(scope, arnParamKey);
    }
}
exports.AlbLookup = AlbLookup;
//# sourceMappingURL=alb-lookup.js.map