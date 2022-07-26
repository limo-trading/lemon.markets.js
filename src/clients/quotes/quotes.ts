import Client, { ClientOptions } from "../../client";
import ResponsePage, { toResponsePage } from "../../response_page";

interface LatestResponse {
    isin: string
    b_v: number
    a_v: number
    b: number
    a: number
    t: string
    mic: string
}

export default class Quotes extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async latest(options: { isin: string, mic?: string }) {
        return new Promise<ResponsePage<LatestResponse>>(async resolve => {
            const response = await this.http_client.get('/quotes/latest', { query: options });
            resolve(toResponsePage(response, this.http_client));
        })
    }
}