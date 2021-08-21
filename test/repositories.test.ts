import {App, Stack} from "@aws-cdk/core";
import {Repositories, RepositoryType} from "../src";

const app = new App();
const stack = new Stack(app, 'repositories');

describe('Repositories Factory', () => {
    it('can create repos with by name and by type', () => {
        const expected = {};
        const r = new Repositories(stack, 'id', {
            repositoryNames: {
                [RepositoryType.NGINX]: 'nginx'
            },
            repositories: [RepositoryType.NGINX, RepositoryType.PHPFPM]
        });
        expect(r.getByName(RepositoryType.NGINX).repositoryArn.startsWith('arn')).toBeTruthy();
        expect(r.getByName(RepositoryType.PHPFPM).repositoryArn.startsWith('arn')).toBeFalsy();
    });
});
