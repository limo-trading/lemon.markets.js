import Client, { ClientOptions } from "../client";
import ResponsePage, { toResponsePage } from "../response_page";

interface PerformanceGetRequest {
    isin?: string
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: bigint
    page?: bigint
}

interface PerformanceGetResponse {
    isin: string
    isin_title: string
    profit: bigint
    loss: bigint
    quantity_bought: bigint
    quantity_sold: bigint
    quantity_open: bigint
    opened_at: string
    closed_at: string
    fees: bigint
}

export default class Performance extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }
    public async get(options?: PerformanceGetRequest) {
        return new Promise<ResponsePage<PerformanceGetResponse>>(async resolve => {
            const response = await this.http_client.get('/positions/performance', { query: options });
            resolve(toResponsePage(response, this.http_client));
        });
    }
}