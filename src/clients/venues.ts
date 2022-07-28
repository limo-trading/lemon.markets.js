import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Venue, ResponsePage } from "../types";

interface VenuesGetParams {
    mic?: string
    limit?: number
    page?: number
}

export default class VenuesClient extends Client<Venue> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: VenuesGetParams) {
        return new Promise<ResponsePage<Venue>>(async resolve => {
            const response = await this.httpClient.get('/venues', { query: options });
            resolve(new PageBuilder<Venue>(this.httpClient, this.cacheLayer)
            .build({
                res: response,
                useId: 'mic'
            }));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}