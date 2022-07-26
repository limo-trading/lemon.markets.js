import Client, { ClientOptions } from "./client";
import ResponsePage, { toResponsePage } from "./response_page";

interface TradesGetRequest {
    isin: string | string[10]
    mic: string
    decimals: boolean
    epoch: boolean
}

interface TradesGetResponse {
    isin: string
    p: number
    v: number
    t: string
    mic: string
}

export default class Trades extends Client {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public latest(options: TradesGetRequest) {
        return new Promise<ResponsePage<TradesGetResponse>>(async resolve => {
            const response = await this.http_client.get('/trades/latest', { query: options });
            resolve(toResponsePage(response.results, this.http_client));
        })
    }
}