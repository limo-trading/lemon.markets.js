import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Instrument, InstrumentType, ResponsePage } from "../index";

interface InstrumentsSearchParams {
    query: string;
    // not all types are mentioned in the lemon.markets docs
    type?: InstrumentType | string;
}

interface InstrumentsGetParams {
    isin?: string | string[];
    // not all types are mentioned in the lemon.markets docs
    type?: InstrumentType | string;
}

export default class InstrumentsClient extends Client<Instrument> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public search(options: InstrumentsSearchParams) {
        return new Promise<ResponsePage<Instrument>>(async resolve => {
            const response = await this.httpClient.get('/instruments', {
                query: {
                    ...options,
                    search: options.query,
                }
            });
            resolve(new PageBuilder<Instrument>(this.httpClient, this.cacheLayer)
            .build({
                res: response
            }))
        })
    }

    public get(options?: InstrumentsGetParams) {
        return new Promise<ResponsePage<Instrument>>(async resolve => {
            if (options?.isin && typeof options.isin !== 'string') options.isin = options.isin.join(',')
            const response = await this.httpClient.get('/instruments', { query: options });
            resolve(new PageBuilder<Instrument>(this.httpClient, this.cacheLayer)
            .build({
                res: response,
            }));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}