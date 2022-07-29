import Client, { ClientOptions } from "../../client";
import { convertDate } from "../../number_dates";
import { PageBuilder } from "../../response_page";
import { Withdrawal, ResponsePage } from "../../types";

interface WithdrawalsCreateParams {
    amount: number
    pin: number
    idempotency?: string
}

interface WithdrawalsGetParams {
    limit?: number
    page?: number
}

export default class WithdrawalsClient extends Client<Withdrawal> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: WithdrawalsGetParams) {
        return new Promise<ResponsePage<Withdrawal>>(async resolve => {
            const response = await this.httpClient.get("/account/withdrawals", { query: options });
            resolve(new PageBuilder<Withdrawal>(this.httpClient, this.cacheLayer)
            .build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    created_at: convertDate(data.created_at),
                    date: convertDate(data.date),
                })
            }));
        });
    }

    public async create(options: WithdrawalsCreateParams) {
        return new Promise<boolean>(async resolve => {
            const response = await this.httpClient.post("/account/withdrawals", { body: options });
            if(response.status === 'ok') resolve(true);
            else resolve(false);
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}