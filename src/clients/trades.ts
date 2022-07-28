import Client, { ClientOptions } from "../client";
import { convertNumber } from "../number_dates";
import { PageBuilder } from "../response_page";
import { Trade, ResponsePage } from "../types";

interface TradesGetParams {
    isin: string | string[]
    mic?: string
    decimals?: boolean
}
export default class TradesClient extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public latest(options: TradesGetParams) {
        return new Promise<ResponsePage<Trade>>(async resolve => {
            if(typeof options.isin !== 'string') options.isin = options.isin.join(',');

            const decimals = options.decimals ?? false
            options.decimals = false;

            const response = await this.httpClient.get('/trades/latest', { query: options });
            resolve(new PageBuilder<Trade>(this.httpClient)
            .build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    p: convertNumber(data.p, decimals),
                }),
            }));
        })
    }
}