import Client, { ClientOptions } from "../../client";
import { PageBuilder } from "../../response_page";
import { ResponsePage } from "../../types";

interface PerformanceGetRequest {
    isin?: string
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
}

interface PerformanceGetResponse {
    isin: string
    isin_title: string
    profit: number
    loss: number
    quantity_bought: number
    quantity_sold: number
    quantity_open: number
    opened_at: string
    closed_at: string
    fees: number
}

export default class Performance extends Client<PerformanceGetResponse> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: PerformanceGetRequest) {
        return new Promise<ResponsePage<PerformanceGetResponse>>(async resolve => {
            const response = await this.httpClient.get('/positions/performance', { query: options });
            resolve(new PageBuilder<PerformanceGetResponse>(this.httpClient, this.cacheLayer).build(response));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}