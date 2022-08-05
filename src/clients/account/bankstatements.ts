import Client, { ClientOptions } from "../../client";
import { convertDate, convertNumber, formatDate } from "../../number_dates";
import { PageBuilder } from "../../response_page";
import { BankStatement, BankStatementType, ResponsePage } from "../../types";

interface BankStatementsGetParams {
    type?: BankStatementType
    from?: Date | 'beginning'
    to?: Date
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
    decimals?: boolean
}

export default class BankStatementsClient extends Client<BankStatement> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?: BankStatementsGetParams) {
        return new Promise<ResponsePage<BankStatement>>(async resolve => {
            const response = await this.httpClient.get('/account/bankstatements', {
                query: {
                    ...options,
                    from: options ? options?.from instanceof Date ? formatDate(options.from): 'beginning' : undefined,
                    to: options?.to ? formatDate(options.to) : undefined,
                }
            });
            
            const decimals = options?.decimals ?? true;
            resolve(new PageBuilder(this.httpClient, this.cacheLayer)
            .build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    date: convertDate(data.date),
                    created_at: convertDate(data.created_at),
                    amount: convertNumber(data.amount, decimals),
                })
            }));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}