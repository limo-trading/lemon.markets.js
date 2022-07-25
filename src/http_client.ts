import fetch, { HeadersInit } from 'node-fetch';
import LemonError, { handleApiError } from './error';

function awaitNewRateLimit(time: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

export default class HttpClient {

    private url: string;
    private auth_token: string;

    private rate_limit: number = 0;
    private rate_remaining: number = 10;
    private rate_reset: number = 0;

    constructor(url: string, auth_token: string) {
        this.url = url;
        this.auth_token = auth_token;
    }

    private async construct_fetch(url: string, method: 'GET' | 'POST' | 'DELETE', options: { headers?: HeadersInit, body?: string | object, query?: {[key: string]: string | number | undefined} }) {

        // check rate limit
        if(this.rate_remaining === 0) {
            const time = this.rate_reset - new Date().getTime();
            // if time is more than 5 seconds, return error
            if(time > 5000) throw new LemonError('Rate limit exceeded. Try again in ~' + time / 1000 + ' seconds.');
            await awaitNewRateLimit(time);
        }

        const headers: HeadersInit = {
            'Authorization': `Bearer ${this.auth_token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        // convert body to string if it is an object or leave it as is if it is a string
        const body: BodyInit = options.body ? typeof options.body === 'string' ? options.body : JSON.stringify(options.body) : '';

        // construct query string
        const query: string = options.query ? `?${Object.keys(options.query).map(key => options.query![key] ? `${key}=${options.query![key]}`: '').join('&')}` : '';

        const res = await fetch(`${url}${query}`, {
            method,
            headers,
            body: method === 'POST' ? body : undefined
        });
        const data = await res.json();
        if(res.status !== 200) handleApiError(data);

        // update rate limit
        this.rate_limit = parseInt(res.headers.get('RateLimit-Limit') || '0');
        this.rate_remaining = parseInt(res.headers.get('RateLimit-Remaining') || '0');
        // reset time
        const seconds = parseInt(res.headers.get('RateLimit-Reset') || '0')
        this.rate_reset = new Date().getTime() + seconds * 1000;

        return await data;
    }
    
    public get(path: string, query?: {[key: string]: string | number | undefined}) {
        return this.construct_fetch(`${this.url}${path}`, 'GET', { query });
    }

    public post(path: string, options: {}) {
        return this.construct_fetch(`${this.url}${path}`, 'POST', options);
    }

    public delete(path: string, options: {}) {
        return this.construct_fetch(`${this.url}${path}`, 'DELETE', options);
    }

    public external_fetch(url: string, options?: {}) {
        return this.construct_fetch(url, 'GET', options || {});
    }
}