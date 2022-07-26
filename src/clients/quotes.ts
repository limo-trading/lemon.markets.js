import Client, { ClientOptions } from "../client";
import ResponsePage, {PageBuilder } from "../response_page";
import { Quote } from "../types";

export default class Quotes extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async latest(options: { isin: string, mic?: string }) {
        return new Promise<ResponsePage<Quote>>(async resolve => {
            const response = await this.httpClient.get('/quotes/latest', { query: options });
            resolve(new PageBuilder<Quote>(this.httpClient).build(response));
        })
    }
}