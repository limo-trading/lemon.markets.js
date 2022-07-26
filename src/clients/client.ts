import HttpClient from "../http_client";

export interface ClientOptions {
    http_client: HttpClient;
}

export default class Client {

    protected http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }
}