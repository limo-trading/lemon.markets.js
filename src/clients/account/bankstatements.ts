import Client, { ClientOptions } from "../../client";
import { convertDate } from "../../number_dates";
import { PageBuilder } from "../../response_page";
import { BankStatement, BankStatementType, ResponsePage } from "../../types";

interface BankStatementsGetParams {
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

    public get(options?: BankStatementsGetParams) {
        return new Promise<ResponsePage<BankStatement>>(async resolve => {
            const response = await this.httpClient.get('/account/bankstatements', { query: options });
            resolve(new PageBuilder(this.httpClient, this.cacheLayer)
            .build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    date: convertDate(data.date),
                    created_at: convertDate(data.created_at),
                })
            }));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}