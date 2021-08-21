import {Naming} from "../src";

describe('Naming', () => {
    it('can add name at index 0', () => {
        const n = new Naming();
        expect(n.next('foo-bar')).toEqual('foo-bar-0');
    });
    it('can get next name if already set', () => {
        const n = new Naming();
        n.next('foo-bar');
        expect(n.next('foo-bar')).toEqual('foo-bar-1');
    });
});
