import HttpClient from "./http_client";
import Cache from "./cache";

export interface ClientOptions {
    http_client: HttpClient;
}

export default class Client<T> {

    protected http_client: HttpClient;
    protected cache_layer: Cache<T>;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
        this.cache_layer = new Cache();
    }
}