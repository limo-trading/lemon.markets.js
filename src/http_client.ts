import fetch, { HeadersInit } from 'node-fetch';
import LemonError, { handleApiError } from './error';

function awaitNewRateLimit(time: number) {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

type FetchMethods = 'GET' | 'POST' | 'DELETE'

type FetchOptions = {
    headers?: HeadersInit,
    body?: string | object,
    query?: {
        [key: string]: string | number | undefined
    }
}

export default class HttpClient {

    private url: string;
    private authToken: string;

    private rateLimit: number = 0;
    private rateRemaining: number = 10;
    private rateReset: number = 0;

    constructor(url: string, authToken: string) {
        this.url = url;
        this.authToken = authToken;
    }

    private async construct_fetch(url: string, method: FetchMethods, options: FetchOptions) {

        // check rate limit
        if (this.rateRemaining === 0) {
            const time = this.rateReset - new Date().getTime();
            // if time is more than 5 seconds, return error
            if (time > 5000) throw new LemonError('Rate limit exceeded. Try again in ~' + time / 1000 + ' seconds.');
            await awaitNewRateLimit(time);
        }

        const headers: HeadersInit = {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
            ...(options?.headers || {})
        };

        // convert body to string if it is an object or leave it as is if it is a string
        const body: BodyInit = options?.body ? typeof options.body === 'string' ? options.body : JSON.stringify(options.body) : '';

        // construct query string
        const query: string = options?.query ? `?${Object.keys(options.query).map(key => options.query![key] ? `${key}=${options.query![key]}` : '').join('&')}` : '';

        const res = await fetch(`${url}${query}`, {
            method,
            headers,
            body: method === 'POST' ? body : undefined
        });
        const data = await res.json();
        if (res.status !== 200) handleApiError(data);

        // update rate limit
        this.rateLimit = parseInt(res.headers.get('RateLimit-Limit') || '0', 10);
        this.rateRemaining = parseInt(res.headers.get('RateLimit-Remaining') || '0', 10);
        // reset time
        const seconds = parseInt(res.headers.get('RateLimit-Reset') || '0', 10)
        this.rateReset = new Date().getTime() + seconds * 1000;

        return await data;
    }

    public get(path: string, options?: {}) {
        return this.construct_fetch(`${this.url}${path}`, 'GET', options!);
    }

    public post(path: string, options?: {}) {
        return this.construct_fetch(`${this.url}${path}`, 'POST', options!);
    }

    public delete(path: string, options?: {}) {
        return this.construct_fetch(`${this.url}${path}`, 'DELETE', options!);
    }

    public external_fetch(url: string, options?: {}) {
        return this.construct_fetch(url, 'GET', options || {});
    }
}