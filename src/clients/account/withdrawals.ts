import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";
import { Withdrawal } from "../../types/withdrawal";

interface WithdrawalsCreateRequest {
    amount: number
    pin: number
    idempotency?: string
}

interface WithdrawalsGetRequest {
    limit?: number
    page?: number
}

export default class WithdrawalsClinet extends Client<Withdrawal> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: WithdrawalsGetRequest) {
        return new Promise<ResponsePage<Withdrawal>>(async resolve => {
            const response = await this.http_client.get("/account/withdrawals", { query: options });
            resolve(new PageBuilder<Withdrawal>(this.http_client, this.cache_layer).build(response));
        });
    }

    public async create(options: WithdrawalsCreateRequest) {
        return new Promise<boolean>(async resolve => {
            const response = await this.http_client.post("/account/withdrawals", { body: options });
            if(response.status === 'ok') resolve(true);
            else resolve(false);
        });
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}