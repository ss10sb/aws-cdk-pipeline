import {App} from "@aws-cdk/core";
import {CommandFactory, EntryPoint, Command} from "../src";

const app = new App();

describe('Command Factory', () => {
    it('can bash entrypoint', () => {
        const expected = {
            command: [
                "artisan",
                "migrate",
                "--seed",
                "--force"
            ],
            entryPoint: ['/bin/sh', '-c']
        };
        const c = new CommandFactory(app, 'id', {});
        expect(c.create(EntryPoint.SH, Command.MIGRATE_SEED)).toEqual(expected);
    });
    it('can create php entrypoint', () => {
        const expected = {
            command: [
                "artisan",
                "migrate",
                "--seed",
                "--force"
            ],
            entryPoint: ['/usr/local/bin/php']
        };
        const c = new CommandFactory(app, 'id', {});
        expect(c.create(EntryPoint.PHP, Command.MIGRATE_SEED)).toEqual(expected);
    });
    it('can add additional arguments', () => {
        const expected = {
            command: [
                "artisan",
                "role:set",
                "123456"
            ],
            entryPoint: ['/bin/bash', '-c']
        };
        const c = new CommandFactory(app, 'id', {});
        expect(c.create(EntryPoint.BASH, Command.ROLE_SET, ['123456'])).toEqual(expected);
    });
});
