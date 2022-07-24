export default class LemonError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LemonError';
    }
} 