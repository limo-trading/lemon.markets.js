import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";

type BankStatementType = 'pay_in' | 'pay_out' | 'order_buy' | 'order_sell' | 'eod_balance' | 'dividend' | 'tax_refunded'

interface BankStatementsGetRequest {
    type?: BankStatementType
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
}

interface BankStatementsGetResponse {
    id: string
    account_id: string
    type: BankStatementType
    date: string
    amount: number
    isin: string
    isin_title: string
    created_at: string
}

export default class BankStatements extends Client<BankStatementsGetResponse> {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: BankStatementsGetRequest) {
        return new Promise<ResponsePage<BankStatementsGetResponse>>(async resolve => {
            const response = await this.http_client.get('/account/bankstatements', { query: options });
            resolve(new PageBuilder(this.http_client, this.cache_layer).build(response));
        });
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}