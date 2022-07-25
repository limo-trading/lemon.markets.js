import fetch, { HeadersInit } from 'node-fetch';
import { handleApiError } from './error';

type trading_mode = 'paper' | 'live';

export default class HttpClient {

    private url: string;
    private auth_token: string;

    constructor(mode: trading_mode, auth_token: string) {
        this.url = `https://${mode === 'paper' ? 'paper-' : ''}trading.lemon.markets/v1`;
        this.auth_token = auth_token;
    }

    private async construct_fetch(url: string, method: 'GET' | 'POST', options: { headers?: HeadersInit, body?: string | object, query?: {[key: string]: string | number | undefined} }) {

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
        if (res.status !== 200)
            handleApiError(data);
        return await data;
    }
    
    public get(path: string, query?: {[key: string]: string | number | undefined}) {
        return this.construct_fetch(`${this.url}${path}`, 'GET', { query });
    }

    public external_fetch(url: string, options?: {}) {
        return this.construct_fetch(url, 'GET', options || {});
    }
}