import Client, { ClientOptions } from "../../client";
import ResponsePage, {PageBuilder } from "../../response_page";

interface LatestResponse {
    isin: string
    b_v: number
    a_v: number
    b: number
    a: number
    t: string
    mic: string
}

export default class Quotes extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async latest(options: { isin: string, mic?: string }) {
        return new Promise<ResponsePage<LatestResponse>>(async resolve => {
            const response = await this.http_client.get('/quotes/latest', { query: options });
            resolve(new PageBuilder<LatestResponse>(this.http_client).build(response));
        })
    }
}