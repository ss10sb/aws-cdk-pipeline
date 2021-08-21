import {Attribute, AttributeType, BillingMode, Table, TableEncryption} from "@aws-cdk/aws-dynamodb";
import {Construct, RemovalPolicy} from "@aws-cdk/core";
import {NonConstruct} from "@smorken/cdk-utils";

export interface DynamoDbProps {
    partitionKey?: Attribute;
    billingMode?: BillingMode;
    encryption?: TableEncryption;
}

export class Dynamodb extends NonConstruct {

    readonly defaults: { [key: string]: any };

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.defaults = {
            partitionKey: {name: 'key', type: AttributeType.STRING},
            billingMode: BillingMode.PAY_PER_REQUEST,
            encryption: TableEncryption.AWS_MANAGED
        };
    }

    create(name: string, props: DynamoDbProps) {
        const tableName = this.mixNameWithId(name);
        return new Table(this.scope, tableName, {
            tableName: tableName,
            partitionKey: props.partitionKey ?? this.defaults.partitionKey,
            billingMode: props.billingMode ?? this.defaults.billingMode,
            encryption: props.encryption ?? this.defaults.encryption,
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}
