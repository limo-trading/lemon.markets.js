import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";
import { BankStatement, BankStatementType } from "../../types";

interface BankStatementsGetRequest {
    type?: BankStatementType
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
}

export default class BankStatements extends Client<BankStatement> {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: BankStatementsGetRequest) {
        return new Promise<ResponsePage<BankStatement>>(async resolve => {
            const response = await this.http_client.get('/account/bankstatements', { query: options });
            resolve(new PageBuilder(this.http_client, this.cache_layer).build(response));
        });
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}