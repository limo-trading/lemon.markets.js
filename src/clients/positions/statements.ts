import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";

type StatementType = 'order_buy' | 'order_sell' | 'split' | 'import' | 'snx'

interface StatementGetRequest {
    type?: StatementType
    limit?: number
    page?: number
}

interface StatementGetResponse {
    id: string
    order_id: string
    external_id: string
    type: StatementType
    quantity: string
    isin: string
    isin_title: string
    date: string
    created_at: string
}

export default class Statements extends Client<StatementGetResponse> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: StatementGetRequest) {
        return new Promise<ResponsePage<StatementGetResponse>>(async resolve => {
            const res = await this.httpClient.get(`/positions/statements`, { query: options })
            resolve(new PageBuilder<StatementGetResponse>(this.httpClient, this.cacheLayer).build(res))
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}