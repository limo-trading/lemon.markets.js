import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Quote, ResponsePage } from "../types";

interface QuoteGetRequest {
    isin: string | string[]
    mic?: string
}

export default class Quotes extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async latest(options: QuoteGetRequest) {
        return new Promise<ResponsePage<Quote>>(async resolve => {
            if (typeof options.isin !== 'string') options.isin = options.isin.join(',')
            const response = await this.httpClient.get('/quotes/latest', { query: options });
            resolve(new PageBuilder<Quote>(this.httpClient).build(response));
        })
    }
}