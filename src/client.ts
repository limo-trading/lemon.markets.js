import HttpClient from "./http_client";
import Cache from "./cache";

export interface ClientOptions {
    httpClient: HttpClient;
}

export default class Client<T> {

    protected httpClient: HttpClient;
    protected cacheLayer: Cache<T>;

    constructor(options: ClientOptions) {
        this.httpClient = options.httpClient;
        this.cacheLayer = new Cache();
    }
}