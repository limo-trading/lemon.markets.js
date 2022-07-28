import Client, { ClientOptions } from "../../client";
import { PageBuilder } from "../../response_page";
import { ResponsePage, Statement, StatementType } from "../../types";

interface StatementGetRequest {
    type?: StatementType
    limit?: number
    page?: number
}

export default class Statements extends Client<Statement> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: StatementGetRequest) {
        return new Promise<ResponsePage<Statement>>(async resolve => {
            const res = await this.httpClient.get(`/positions/statements`, { query: options })
            resolve(new PageBuilder<Statement>(this.httpClient, this.cacheLayer).build(res))
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}