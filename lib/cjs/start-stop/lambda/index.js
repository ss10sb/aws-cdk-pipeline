"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_ecs_1 = require("@aws-sdk/client-ecs");
const handler = async (event) => {
    var _a;
    const promises = new Array();
    const ecs = new client_ecs_1.ECS({});
    const services = await ecs.listServices({
        cluster: event.cluster,
        launchType: client_ecs_1.LaunchType.FARGATE,
        schedulingStrategy: client_ecs_1.SchedulingStrategy.REPLICA,
        maxResults: 50
    });
    const desiredCount = event.status == 'start' ? 1 : 0;
    for (const service of (_a = services.serviceArns) !== null && _a !== void 0 ? _a : []) {
        promises.push(updateService(ecs, {
            cluster: event.cluster,
            service: service,
            desiredCount: desiredCount
        }));
    }
    return Promise.all(promises);
};
exports.handler = handler;
function updateService(ecs, params) {
    return new Promise((resolve, reject) => {
        ecs.updateService(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // An error occurred
                resolve(`${params.service} not updated`);
            }
            else {
                console.log(data); // Successful response
                resolve(`${params.service} updated => Desired count: ${params.desiredCount}`);
            }
        });
    });
}
//# sourceMappingURL=index.js.map