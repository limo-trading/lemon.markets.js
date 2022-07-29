import Client, { ClientOptions } from '../client';
import Statements from './positions/statements';
import Performance from './positions/performance';
import { PageBuilder } from '../response_page';
import { Position, ResponsePage } from '../types';
import { convertNumber } from '../number_dates';

interface PositionsGetParams {
    isin?: string
    limit?: number
    page?: number
    decimals?: boolean
}

export default class PositionsClient extends Client<Position> {

    public statements: Statements;
    public performance: Performance;

    constructor(options: ClientOptions) {
        super(options);

        this.statements = new Statements(options);
        this.performance = new Performance(options);
    }

    public get(options?: PositionsGetParams) {
        return new Promise<ResponsePage<Position>>(async resolve => {
            const response = await this.httpClient.get('/positions', { query: options });

            const decimals = options?.decimals ?? true;

            resolve(new PageBuilder<Position>(this.httpClient, this.cacheLayer)
                .build({
                    res: response,
                    useId: 'isin',
                    override: (data: any) => ({
                        ...data,
                        buy_price_avg: convertNumber(data.buy_price_avg, decimals),
                        estimated_price_total: convertNumber(data.estimated_price_total, decimals),
                        estimated_price: convertNumber(data.estimated_price, decimals)
                    })
                }))
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}