import Client, { ClientOptions } from "../client";
import ResponsePage, { toResponsePage } from "../response_page";

interface VenuesGetRequest {
    mic?: string
    limit?: bigint
    page?: bigint
}

interface VenuesGetResponse {
    name: string
    title: string
    mic: string
    is_open: boolean
}

export default class Venues extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: VenuesGetRequest) {
        return new Promise<ResponsePage<VenuesGetResponse>>(async resolve => {
            const response = await this.http_client.get('/venues', { query: options });
            resolve(toResponsePage(response, this.http_client));
        })
    }
}