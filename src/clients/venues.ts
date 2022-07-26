import Client, { ClientOptions } from "../client";
import ResponsePage, { PageBuilder } from "../response_page";

interface VenuesGetRequest {
    mic?: string
    limit?: number
    page?: number
}

interface VenuesGetResponse {
    name: string
    title: string
    mic: string
    is_open: boolean
}

export default class Venues extends Client<VenuesGetResponse> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: VenuesGetRequest) {
        return new Promise<ResponsePage<VenuesGetResponse>>(async resolve => {
            const response = await this.httpClient.get('/venues', { query: options });
            resolve(new PageBuilder<VenuesGetResponse>(this.httpClient, this.cacheLayer).build(response));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}