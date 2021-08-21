import {ConfigStack} from "@smorken/cdk-utils";
import {StackConfig} from "../definitions/stack-config";
import {Clientable} from "./clientable";
import {
    DescribeImagesCommand,
    DescribeImagesResponse,
    ECRClient,
    ECRClientConfig,
    TagStatus
} from "@aws-sdk/client-ecr";

export class EcrTag<T extends StackConfig> extends Clientable<T> {
    client: ECRClient;
    static cached: { [key: string]: string } = {};

    constructor(stack: ConfigStack<T>) {
        super(stack);
        this.client = this.createClient(this.getClientConfig());
    }

    async fetch(imageName: string): Promise<string> {
        if (EcrTag.cached[imageName]) {
            console.log('cached tag');
            return EcrTag.cached[imageName];
        }
        const command = new DescribeImagesCommand({
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: imageName
        });
        let response: DescribeImagesResponse | undefined = undefined;
        try {
            response = await this.client.send(command);
        } catch (error) {
            console.log(`Registry for ${imageName} not found.`, error);
        }
        const tag = this.getNextTag(response);
        EcrTag.cached[imageName] = tag;
        return tag;
    }

    private getNextTag(response?: DescribeImagesResponse): string {
        if (response && response.imageDetails) {
            let tag = 1;
            for (const imageDetail of response.imageDetails) {
                for (const imageTag of imageDetail.imageTags ?? []) {
                    const numeric: number = parseInt(imageTag);
                    if (numeric > tag) {
                        tag = numeric;
                    }
                }
            }
            return (tag + 1).toString();
        }
        return '1';
    }

    private createClient(config: ECRClientConfig = {}): ECRClient {
        return new ECRClient(config);
    }

    private getClientConfig(): ECRClientConfig {
        return {
            region: this.stack.region
        };
    }
}
