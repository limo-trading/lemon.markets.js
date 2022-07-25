import HttpClient from "../http_client";
import ClientOptions from "./client_options";

export default class Account {

    private http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }

    public async get() {
        return await this.http_client.get('/account');
    }
}