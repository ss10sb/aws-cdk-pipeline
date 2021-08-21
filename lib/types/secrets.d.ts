import { ISecret, Secret } from "@aws-cdk/aws-secretsmanager";
import * as ecs from "@aws-cdk/aws-ecs";
import { NonConstruct } from "@smorken/cdk-utils";
import { SecretItem } from "./definitions/secrets-config";
export declare class Secrets extends NonConstruct {
    secret?: ISecret;
    fetch(): ISecret;
    getEcsSecretsFromSecret(keys: string[], secret: ISecret): {
        [key: string]: ecs.Secret;
    };
    getEcsSecrets(keys: string[]): {
        [key: string]: ecs.Secret;
    };
    create(secrets: SecretItem[]): Secret;
    private getSecretName;
    private convertParametersToJson;
}
