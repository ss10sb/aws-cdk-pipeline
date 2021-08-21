import {Config, ConfigParameters} from "@smorken/cdk-utils";

export interface SecretsConfig extends Config {
    readonly Parameters: SecretsParameters;
}

export interface SecretItem {
    key: string;
    value: string | number | boolean;
}

export interface SecretsParameters extends ConfigParameters {
    readonly secrets: SecretItem[];
}
