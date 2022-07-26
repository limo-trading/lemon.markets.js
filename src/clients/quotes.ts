import { LatestQuote } from "../types/trades";
import Client, { ClientOptions } from "../client";
import ResponsePage, {PageBuilder } from "../response_page";

export default class Quotes extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async latest(options: { isin: string, mic?: string }) {
        return new Promise<ResponsePage<LatestQuote>>(async resolve => {
            const response = await this.http_client.get('/quotes/latest', { query: options });
            resolve(new PageBuilder<LatestQuote>(this.http_client).build(response));
        })
    }
}