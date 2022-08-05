import Client, { ClientOptions } from "../../client";
import { convertDate } from "../../number_dates";
import { PageBuilder } from "../../response_page";
import { ResponsePage, Statement, StatementType } from "../../index";

interface StatementGetParams {
    type?: StatementType
    limit?: number
    page?: number
}

export default class StatementsClient extends Client<Statement> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: StatementGetParams) {
        return new Promise<ResponsePage<Statement>>(async resolve => {
            const res = await this.httpClient.get(`/positions/statements`, { query: options })
            resolve(new PageBuilder<Statement>(this.httpClient, this.cacheLayer)
            .build({
                res,
                override: (data: any) => ({
                    ...data,
                    created_at: convertDate(data.created_at),
                    date: convertDate(data.date),
                })
            }))
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}