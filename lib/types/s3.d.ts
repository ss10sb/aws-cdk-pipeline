import { NonConstruct } from "@smorken/cdk-utils";
import { Construct, RemovalPolicy } from "@aws-cdk/core";
import { BlockPublicAccess, Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Key } from "@aws-cdk/aws-kms";
export interface S3Props {
    removalPolicy?: RemovalPolicy;
    blockPublicAccess?: BlockPublicAccess;
    autoDeleteObjects?: boolean;
    encryption?: BucketEncryption;
    encryptionKey?: Key;
    bucketKeyEnabled?: boolean;
}
export declare class S3 extends NonConstruct {
    readonly defaults: {
        [key: string]: any;
    };
    constructor(scope: Construct, id: string);
    create(name: string, props: S3Props): Bucket;
}
