import {GetParameterCommand, SSMClient, SSMClientConfig} from "@aws-sdk/client-ssm";
import {ConfigLoader, ConfigStack} from "@smorken/cdk-utils";
import {StackConfig} from "../definitions/stack-config";
import * as path from "path";
import * as fs from "fs";
import {Clientable} from "./clientable";

export class ConfigParam<T extends StackConfig> extends Clientable<T> {
    configDir: string;
    client: SSMClient;
    fileName: string = 'param-store.json';


    constructor(stack: ConfigStack<T>, configDir: string) {
        super(stack);
        this.configDir = configDir;
        this.client = this.createClient(this.getClientConfig());
    }

    async fetch(key: string): Promise<T> {
        const cached = this.fromParamStoreFile();
        if (cached) {
            return cached;
        }
        const command = new GetParameterCommand({Name: key});
        const response = await this.client.send(command);
        const parameter = response.Parameter ?? {};
        const config = ConfigLoader.convertStringToConfig<T>(parameter.Value ?? '');
        this.toParamStoreFile(config);
        return config;
    }

    remove(): void {
        const file = this.getParamStoreFileName();
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }

    private fromParamStoreFile(): T | undefined {
        const file = this.getParamStoreFileName();
        if (fs.existsSync(file)) {
            return ConfigLoader.convertStringToConfig<T>(fs.readFileSync(file, 'utf8'));
        }
    }

    private toParamStoreFile(config: T): void {
        try {
            const file = this.getParamStoreFileName();
            fs.writeFileSync(file, JSON.stringify(config));
        } catch (e) {
            console.log(e);
        }
    }

    private getParamStoreFileName(): string {
        return path.resolve(this.configDir, this.fileName);
    }

    private createClient(config: SSMClientConfig = {}): SSMClient {
        return new SSMClient(config);
    }

    private getClientConfig(): SSMClientConfig {
        return {
            region: this.stack.region
        };
    }
}
