import {
    ECS,
    LaunchType,
    ListServicesCommandOutput,
    SchedulingStrategy,
    UpdateServiceCommandOutput
} from "@aws-sdk/client-ecs";

interface EventLambda {
    cluster: string,
    status: string
}

interface UpdateServiceParams {
    cluster: string
    service: string
    desiredCount: number
}

export const handler = async (event: EventLambda): Promise<string[]> => {
    const promises = new Array<Promise<any>>();
    const ecs = new ECS({});
    const services: ListServicesCommandOutput = await ecs.listServices({
        cluster: event.cluster,
        launchType: LaunchType.FARGATE,
        schedulingStrategy: SchedulingStrategy.REPLICA,
        maxResults: 50
    });
    const desiredCount = event.status == 'start' ? 1 : 0
    for (const service of services.serviceArns ?? []) {
        promises.push(updateService(ecs, {
            cluster: event.cluster,
            service: service,
            desiredCount: desiredCount
        }));
    }
    return Promise.all(promises);
};

function updateService(ecs: ECS, params: UpdateServiceParams): Promise<string> {
    return new Promise((resolve, reject) => {
        ecs.updateService(params, function (err: any, data?: UpdateServiceCommandOutput) {
            if (err) {
                console.log(err, err.stack); // An error occurred
                resolve(`${params.service} not updated`);
            } else {
                console.log(data); // Successful response
                resolve(`${params.service} updated => Desired count: ${params.desiredCount}`)
            }
        });
    })
}