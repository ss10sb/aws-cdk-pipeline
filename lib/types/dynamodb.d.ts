import { Attribute, BillingMode, Table, TableEncryption } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { NonConstruct } from "@smorken/cdk-utils";
export interface DynamoDbProps {
    partitionKey?: Attribute;
    billingMode?: BillingMode;
    encryption?: TableEncryption;
}
export declare class Dynamodb extends NonConstruct {
    readonly defaults: {
        [key: string]: any;
    };
    constructor(scope: Construct, id: string);
    create(name: string, props: DynamoDbProps): Table;
}
