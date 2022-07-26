import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Trade, ResponsePage } from "../types";

interface TradesGetRequest {
    isin: string | string[]
    mic?: string
    decimals?: boolean
    epoch?: boolean
}
export default class Trades extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public latest(options: TradesGetRequest) {
        return new Promise<ResponsePage<Trade>>(async resolve => {
            if(typeof options.isin !== 'string') options.isin = options.isin.join(',');
            const response = await this.httpClient.get('/trades/latest', { query: options });
            resolve(new PageBuilder<Trade>(this.httpClient).build(response));
        })
    }
}