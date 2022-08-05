import Client, { ClientOptions } from "../../client";
import { convertDate, convertNumber, formatDate } from "../../number_dates";
import { PageBuilder } from "../../response_page";
import { ResponsePage, Performance } from "../../index";

interface PerformanceGetParams {
    isin?: string
    from?: Date
    to?: Date
    sorting?: 'asc' | 'desc'
    limit?: number
    page?: number
    decimals?: boolean
}

export default class PerformanceClient extends Client<Performance> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async get(options?: PerformanceGetParams) {
        return new Promise<ResponsePage<Performance>>(async resolve => {
            const response = await this.httpClient.get('/positions/performance', {
                query: {
                    ...options,
                    from: options?.from ? formatDate(options.from) : undefined,
                    to: options?.to ? formatDate(options.to) : undefined,
                }
            });

            const decimals = options?.decimals ?? true;

            resolve(new PageBuilder<Performance>(this.httpClient, this.cacheLayer)
                .build({
                    res: response,
                    useId: 'isin',
                    override: (data: any) => ({
                        ...data,
                        profit: convertNumber(data.profit, decimals),
                        loss: convertNumber(data.loss, decimals),
                        opened_at: convertDate(data.opened_at),
                        closed_at: convertDate(data.closed_at),
                        fees: convertNumber(data.fees, decimals),
                    })
                }));
        });
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}