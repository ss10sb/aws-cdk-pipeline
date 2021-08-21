import {ConfigStack} from "@smorken/cdk-utils";
import {Secrets} from "../secrets";
import {Secret} from "@aws-cdk/aws-secretsmanager";
import {SecretsConfig} from "../definitions/secrets-config";

export class SecretsStack<T extends SecretsConfig> extends ConfigStack<T> {

    exec() {
        this.createSecret();
    }

    private createSecret(): Secret {
        const s = new Secrets(this,  this.node.id);
        return s.create(this.config.Parameters.secrets);
    }
}
