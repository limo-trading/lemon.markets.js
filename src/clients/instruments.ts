import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Instrument, InstrumentType, ResponsePage } from "../types";

interface InstrumentsGetParams {
    isin?: string | string[];
    search?: string;
    type?: InstrumentType;
}

export default class InstrumentsClient extends Client<Instrument> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options: InstrumentsGetParams) {
        return new Promise<ResponsePage<Instrument>>(async resolve => {
            if (options.isin && typeof options.isin !== 'string') options.isin = options.isin.join(',')
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