import Client, { ClientOptions } from "../client";
import ResponsePage, { PageBuilder } from "../response_page";

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

export default class Trades extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public latest(options: TradesGetRequest) {
        return new Promise<ResponsePage<TradesGetResponse>>(async resolve => {
            const response = await this.httpClient.get('/trades/latest', { query: options });
            resolve(new PageBuilder<TradesGetResponse>(this.httpClient).build(response.results));
        })
    }
}