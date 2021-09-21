interface EventLambda {
    cluster: string;
    status: string;
}
export declare const handler: (event: EventLambda) => Promise<void>;
export {};
