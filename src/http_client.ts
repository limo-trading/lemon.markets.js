type trading_mode = 'paper' | 'live';

export default class HttpClient {

    private url: string;
    private auth_token: string;

    constructor(mode: trading_mode, auth_token: string) {
        this.url = `https://${mode === 'paper' ? 'paper-' : ''}trading.lemon.trade/api`;
        this.auth_token = auth_token;
    }

    private construct_fetch(path: string, method: 'GET' | 'POST', options: { headers?: { [key: string]: string }, body?:any }) {

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${this.auth_token}`);
        headers.append('Content-Type', 'application/json');
        if(options.headers) {
            for(const key in options.headers) {
                headers.append(key, options.headers[key]);
            }
        }

        const body = typeof options.body === 'string' ? options.body : typeof options.body === 'object' ? JSON.stringify(options.body) : undefined;
        delete options.body;
        if(!body) throw new Error('Body must be a string or object.');

        return fetch(`${this.url}${path}`, {
            headers,
            method,
            body,
            ...options,
        });
    }
    
    public get(path: string, options?: {}) {
        return this.construct_fetch(path, 'GET', options || {});
    }
}