import {ISecret, Secret} from "@aws-cdk/aws-secretsmanager";
import * as ecs from "@aws-cdk/aws-ecs";
import {NonConstruct} from "@smorken/cdk-utils";
import {SecretItem} from "./definitions/secrets-config";

export class Secrets extends NonConstruct {
    secret?: ISecret;

    fetch(): ISecret {
        if (!this.secret) {
            this.secret = Secret.fromSecretNameV2(this.scope, `${this.id}-secret-lookup`, this.getSecretName());
        }
        return this.secret;
    }

    getEcsSecretsFromSecret(keys: string[], secret: ISecret): { [key: string]: ecs.Secret } {
        let secrets: { [key: string]: ecs.Secret } = {};
        for (const key of keys) {
            secrets[key] = ecs.Secret.fromSecretsManager(secret, key);
        }
        return secrets;
    }

    getEcsSecrets(keys: string[]): { [key: string]: ecs.Secret } {
        const secret = this.fetch();
        return this.getEcsSecretsFromSecret(keys, secret);
    }

    create(secrets: SecretItem[]): Secret {
        return new Secret(this.scope, `${this.id}-secret`, {
            secretName: this.getSecretName(),
            generateSecretString: {
                secretStringTemplate: this.convertParametersToJson(secrets),
                generateStringKey: 'salt'
            }
        });
    }

    private getSecretName(suffix: string = '/environment'): string {
        let name = this.id;
        if (!name.endsWith('-secrets')) {
            name += '-secrets';
        }
        return name + suffix;
    }

    private convertParametersToJson(secrets: SecretItem[]): string {
        let params: { [key: string]: any } = {};
        for (const secret of secrets) {
            params[secret.key] = secret.value;
        }
        return JSON.stringify(params);
    }
}
