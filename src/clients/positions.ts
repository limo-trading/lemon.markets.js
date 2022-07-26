import Client, { ClientOptions } from '../client';
import Statements from './positions/statements';
import Performance from './positions/performance';
import ResponsePage, { PageBuilder } from '../response_page';
import { Position } from '../types';

interface PositionsGetRequest {
    isin?: string
    limit?: number
    page?: number
}

export default class PositionsClient extends Client<Position> {

    public statements: Statements;
    public performance: Performance;

    constructor(options: ClientOptions) {
        super(options);

        this.statements = new Statements(options);
        this.performance = new Performance(options);
    }

    public get(options?:PositionsGetRequest) {
        return new Promise<ResponsePage<Position>>(async resolve => {
            const response = await this.httpClient.get('/positions', { query: options });
            resolve(new PageBuilder<Position>(this.httpClient, this.cacheLayer).build(response, 'isin'));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}