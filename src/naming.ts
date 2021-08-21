export class Naming {
    private names: { [key: string]: number } = {};

    next(name: string): string {
        if (this.names[name] === undefined) {
            this.names[name] = 0;
        } else {
            this.names[name]++;
        }
        return `${name}-${this.names[name]}`;
    }
}
