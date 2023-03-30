/**
 * Optional value object
 */
export class Optional<T> {
    private readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    public isPresent(): boolean {
        return this.value !== null;
    }

    public get(): any {
        return this.value;
    }

    public map(fn: (val) => any) {
        return fn(this.value);
    }
}
