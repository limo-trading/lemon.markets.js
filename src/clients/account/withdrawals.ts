import Client, { ClientOptions } from "../../client";
import ResponsePage, { PageBuilder } from "../../response_page";

interface WithdrawalsCreateRequest {
    amount: number
    pin: number
    idempotency?: string
}

interface WithdrawalsGetRequest {
    limit?: number
    page?: number
}

interface WithdrawalsGetResponse {
    id: string
    amount: string
    created_at: string
    date: string
    idempotency: string
}

export default class Withdrawals extends Client<WithdrawalsGetResponse> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: WithdrawalsGetRequest) {
        return new Promise<ResponsePage<WithdrawalsGetResponse>>(async resolve => {
            const response = await this.http_client.get("/withdrawals", { query: options });
            resolve(new PageBuilder<WithdrawalsGetResponse>(this.http_client, this.cache_layer).build(response));
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