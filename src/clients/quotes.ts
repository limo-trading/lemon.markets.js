import Client, { ClientOptions } from "../client";
import { convertDate, convertNumber } from "../number_dates";
import { PageBuilder } from "../response_page";
import { Quote, ResponsePage } from "../index";

interface QuoteGetParams {
    isin: string | string[]
    mic?: string,
    decimals?: boolean
}

export default class QuotesClient extends Client<void> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async latest(options: QuoteGetParams) {
        return new Promise<ResponsePage<Quote>>(async resolve => {
            if (typeof options.isin !== 'string') options.isin = options.isin.join(',')

            const decimals = options.decimals ?? true;
            options.decimals = false

            const response = await this.httpClient.get('/quotes/latest', { query: options });

            resolve(new PageBuilder<Quote>(this.httpClient).build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    b: convertNumber(data.b, decimals),
                    a: convertNumber(data.a, decimals),
                    t: convertDate(data.t),
                })
            }));
        })
    }
}