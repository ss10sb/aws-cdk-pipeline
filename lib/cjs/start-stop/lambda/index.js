"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws = require('aws-sdk');
const ecs = new aws.ECS();
const handler = async (event) => {
    var _a;
    console.log('Event', event);
    const desiredCount = event.status == 'start' ? 1 : 0;
    try {
        const data = await ecs.listServices({
            cluster: event.cluster,
            maxResults: 50
        }).promise();
        console.log('Data', data);
        for (const service of (_a = data.serviceArns) !== null && _a !== void 0 ? _a : []) {
            await updateService({
                cluster: event.cluster,
                service: service,
                desiredCount: desiredCount
            });
        }
    }
    catch (error) {
        console.log('Error', error);
    }
};
exports.handler = handler;
async function updateService(params) {
    try {
        await ecs.updateService(params).promise();
        console.log(`Updated ${params.service} to ${params.desiredCount} count.`);
    }
    catch (error) {
        console.log('Error', error);
    }
}
//# sourceMappingURL=index.js.map