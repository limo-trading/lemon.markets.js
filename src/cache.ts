export default class Cache<T> {

    private cache: { [key: string]: T };

    constructor() {
        this.cache = {};
    }

    public getAll(): T[] {
        return Object.values(this.cache);
    }

    public get(key: string): T {
        return this.cache[key];
    }

    public getDefault(): T {
        return this.get('default');
    }

    public set(key: string, value: T): void {
        this.cache[key] = value;
    }

    public setDefault(value: T): void {
        this.set('default', value);
    }

    public delete(key: string): void {
        delete this.cache[key];
    }
}