const aws = require('aws-sdk');
const ecs = new aws.ECS();

interface EventLambda {
    cluster: string,
    status: string
}

interface UpdateServiceParams {
    cluster: string
    service: string
    desiredCount: number
}

interface ListServicesResponse {
    serviceArns: string[];
}

interface UpdateServicesResponse {

}

export const handler = async (event: EventLambda) => {
    console.log('Event', event);
    const desiredCount = event.status == 'start' ? 1 : 0;
    const cluster = event.cluster ?? process.env.CLUSTER;
    try {
        const data: ListServicesResponse = await ecs.listServices({
            cluster: cluster,
            maxResults: 50
        }).promise();
        console.log('Data', data);
        for (const service of data.serviceArns ?? []) {
            await updateService({
                cluster: cluster,
                service: service,
                desiredCount: desiredCount
            });
        }
    } catch (error) {
        console.log('Error', error);
    }
};

async function updateService(params: UpdateServiceParams) {
    try {
        await ecs.updateService(params).promise();
        console.log(`Updated ${params.service} to ${params.desiredCount} count.`);
    } catch (error) {
        console.log('Error', error);
    }
}