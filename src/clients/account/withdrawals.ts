import Client, { ClientOptions } from "../client";
import ResponsePage from "../response_page";

interface WithdrawalsCreateRequest {
    amount: bigint
    pin: bigint
    idempotency?: string
}

interface WithdrawalsGetRequest {
    limit?: bigint
    page?: bigint
}

interface WithdrawalsGetResponse {
    id: string
    amount: string
    created_at: string
    date: string
    idempotency: string
}

export default class Withdrawals extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: WithdrawalsGetRequest) {
        return new Promise<ResponsePage<WithdrawalsGetResponse>>(async resolve => {
            const response = await this.http_client.get("/withdrawals", { query: options });
            resolve(response.results);
        });
    }

    public async create(options: WithdrawalsCreateRequest) {
        return new Promise<boolean>(async resolve => {
            const response = await this.http_client.post("/account/withdrawals", { body: options });
            if(response.status === 'ok') resolve(true);
            else resolve(false);
        });
    }
}