"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcrTag = void 0;
const clientable_1 = require("./clientable");
const client_ecr_1 = require("@aws-sdk/client-ecr");
class EcrTag extends clientable_1.Clientable {
    constructor(stack) {
        super(stack);
        this.client = this.createClient(this.getClientConfig());
    }
    async fetch(imageName) {
        if (EcrTag.cached[imageName]) {
            console.log('cached tag');
            return EcrTag.cached[imageName];
        }
        const command = new client_ecr_1.DescribeImagesCommand({
            filter: {
                tagStatus: client_ecr_1.TagStatus.TAGGED
            },
            repositoryName: imageName
        });
        let response = undefined;
        try {
            response = await this.client.send(command);
        }
        catch (error) {
            console.log(`Registry for ${imageName} not found.`, error);
        }
        const tag = this.getNextTag(response);
        EcrTag.cached[imageName] = tag;
        return tag;
    }
    getNextTag(response) {
        var _a;
        if (response && response.imageDetails) {
            let tag = 1;
            for (const imageDetail of response.imageDetails) {
                for (const imageTag of (_a = imageDetail.imageTags) !== null && _a !== void 0 ? _a : []) {
                    const numeric = parseInt(imageTag);
                    if (numeric > tag) {
                        tag = numeric;
                    }
                }
            }
            return (tag + 1).toString();
        }
        return '1';
    }
    createClient(config = {}) {
        return new client_ecr_1.ECRClient(config);
    }
    getClientConfig() {
        return {
            region: this.stack.region
        };
    }
}
exports.EcrTag = EcrTag;
EcrTag.cached = {};
//# sourceMappingURL=ecr-tag.js.map