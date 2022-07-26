import Client, { ClientOptions } from "../../client";
import { PageBuilder } from "../../response_page";
import { BankStatement, BankStatementType, ResponsePage } from "../../types";

interface BankStatementsGetRequest {
    type?: BankStatementType
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
}

export default class BankStatementsClient extends Client<BankStatement> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: BankStatementsGetRequest) {
        return new Promise<ResponsePage<BankStatement>>(async resolve => {
            const response = await this.httpClient.get('/account/bankstatements', { query: options });
            resolve(new PageBuilder(this.httpClient, this.cacheLayer).build(response));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}