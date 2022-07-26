import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Venue, ResponsePage } from "../types";

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
            resolve(new PageBuilder<Venue>(this.httpClient, this.cacheLayer).build(response, 'mic'));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}