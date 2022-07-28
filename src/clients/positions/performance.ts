import Client, { ClientOptions } from "../../client";
import { PageBuilder } from "../../response_page";
import { ResponsePage, Performance } from "../../types";

interface PerformanceGetRequest {
    isin?: string
    from?: string
    to?: string
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
}

export default class PerformanceClient extends Client<Performance> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: PerformanceGetRequest) {
        return new Promise<ResponsePage<Performance>>(async resolve => {
            const response = await this.httpClient.get('/positions/performance', { query: options });
            resolve(new PageBuilder<Performance>(this.httpClient, this.cacheLayer).build(response));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}