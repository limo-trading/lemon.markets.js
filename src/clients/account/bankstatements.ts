import Client, { ClientOptions } from "../client";
import ResponsePage, { toResponsePage } from "../response_page";

type BankStatementType = 'pay_in' | 'pay_out' | 'order_buy' | 'order_sell' | 'eod_balance' | 'dividend' | 'tax_refunded'

interface BankStatementsGetRequest {
    type?: BankStatementType
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: bigint
    page?: bigint
}

interface BankStatementsGetResponse {
    id: string
    account_id: string
    type: BankStatementType
    date: string
    amount: bigint
    isin: string
    isin_title: string
    created_at: string
}

export default class BankStatements extends Client {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: BankStatementsGetRequest) {
        return new Promise<ResponsePage<BankStatementsGetResponse>>(async resolve => {
            const response = await this.http_client.get('/account/bankstatements', { query: options });
            resolve(toResponsePage(response, this.http_client));
        });
    }
}