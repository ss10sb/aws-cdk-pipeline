import {NonConstruct} from "@smorken/cdk-utils";
import {Construct, RemovalPolicy} from "@aws-cdk/core";
import {BlockPublicAccess, Bucket, BucketEncryption} from "@aws-cdk/aws-s3";
import {Key} from "@aws-cdk/aws-kms";

export interface S3Props {
    removalPolicy?: RemovalPolicy;
    blockPublicAccess?: BlockPublicAccess;
    autoDeleteObjects?: boolean;
    encryption?: BucketEncryption;
    encryptionKey?: Key;
    bucketKeyEnabled?: boolean;
}

export class S3 extends NonConstruct {
    readonly defaults: { [key: string]: any };

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.defaults = {
            autoDeleteObjects: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.RETAIN,
            enforceSSL: true,
            encryption: BucketEncryption.KMS_MANAGED
        };
    }

    public create(name: string, props: S3Props): Bucket {
        const bucketName = this.mixNameWithId(name);
        return new Bucket(this.scope, bucketName, {
            bucketName: bucketName,
            blockPublicAccess: props.blockPublicAccess ?? this.defaults.blockPublicAccess,
            removalPolicy: props.removalPolicy ?? this.defaults.removalPolicy,
            autoDeleteObjects: props.autoDeleteObjects ?? this.defaults.autoDeleteObjects,
            encryption: props.encryption ?? this.defaults.encryption,
            encryptionKey: props.encryptionKey ?? undefined,
            enforceSSL: this.defaults.enforceSSL,
            bucketKeyEnabled: props.bucketKeyEnabled ?? undefined
        });
    }
}