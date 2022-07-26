import Client, { ClientOptions } from "../client";
import ResponsePage, { PageBuilder } from "../response_page";

type InstrumentType = 'stock' | 'etf'

interface InstrumentsGetRequest {
    isin?: string | string[10];
    search?: string;
    type?: InstrumentType;
}

interface InstrumentsGetResponse {
    isin: string;
    wkn: string;
    name: string;
    title: string;
    symbol: string;
    type: InstrumentType;
}

export default class Instruments extends Client<InstrumentsGetResponse> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options: InstrumentsGetRequest) {
        return new Promise<ResponsePage<InstrumentsGetResponse>>(async resolve => {
            const response = await this.httpClient.get('/instruments', { query: options });
            resolve(new PageBuilder<InstrumentsGetResponse>(this.httpClient, this.cacheLayer).build(response));
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}