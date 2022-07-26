import Client, { ClientOptions } from './client';
import ResponsePage, { toResponsePage } from './response_page';

interface PositionsGetRequest {
    isin?: string
    limit?: number
    page?: number
}

interface PositionsGetResponse {
    isin: string
    isin_title: string
    quantity: number
    buy_price_avg: number
    estimated_price_total: number
    estimated_price: number
}

export default class Positions extends Client {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options?:PositionsGetRequest) {
        return new Promise<ResponsePage<PositionsGetResponse>>(async resolve => {
            const response = await this.http_client.get('/positions', { query: options });
            resolve(toResponsePage(response, this.http_client));
        })
    }

    // TODO: GET /positions/statements
    // TODO: GET /positions/performance
}