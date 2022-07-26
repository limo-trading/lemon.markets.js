import Client, { ClientOptions } from '../client';
import Statements from './positions/statements';
import Performance from './positions/performance';
import ResponsePage, { PageBuilder } from '../response_page';

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

export default class Positions extends Client<PositionsGetResponse> {

    public statements: Statements;
    public performance: Performance;

    constructor(options: ClientOptions) {
        super(options);

        this.statements = new Statements(options);
        this.performance = new Performance(options);
    }

    public get(options?:PositionsGetRequest) {
        return new Promise<ResponsePage<PositionsGetResponse>>(async resolve => {
            const response = await this.http_client.get('/positions', { query: options });
            resolve(new PageBuilder<PositionsGetResponse>(this.http_client, this.cache_layer).build(response));
        })
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}