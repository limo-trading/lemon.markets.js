import Client, { ClientOptions } from "../client";
import ResponsePage, { PageBuilder } from "../response_page";
import { Venue } from "../types";

interface VenuesGetRequest {
    mic?: string
    limit?: number
    page?: number
}

export default class VenuesClient extends Client<Venue> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: VenuesGetRequest) {
        return new Promise<ResponsePage<Venue>>(async resolve => {
            const response = await this.httpClient.get('/venues', { query: options });
            resolve(new PageBuilder<Venue>(this.httpClient, this.cacheLayer).build(response));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}