import Client, { ClientOptions } from "../../client";
import ResponsePage, { toResponsePage } from "../../response_page";

type StatementType = 'order_buy' | 'order_sell' | 'split' | 'import' | 'snx'

interface StatementGetRequest {
    type?: StatementType
    limit?: bigint
    page?: bigint
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

export default class Statements extends Client {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: StatementGetRequest) {
        return new Promise<ResponsePage<StatementGetResponse>>(async resolve => {
            const res = await this.http_client.get(`/positions/statements`, { query: options })
            resolve(toResponsePage(res, this.http_client))
        })
    }
}