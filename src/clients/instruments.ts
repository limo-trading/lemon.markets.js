import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Instrument, InstrumentType, ResponsePage } from "../types";

interface InstrumentsGetRequest {
    isin?: string | string[10];
    search?: string;
    type?: InstrumentType;
}

export default class InstrumentsClient extends Client<Instrument> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options: InstrumentsGetRequest) {
        return new Promise<ResponsePage<Instrument>>(async resolve => {
            const response = await this.httpClient.get('/instruments', { query: options });
            resolve(new PageBuilder<Instrument>(this.httpClient, this.cacheLayer).build(response));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}