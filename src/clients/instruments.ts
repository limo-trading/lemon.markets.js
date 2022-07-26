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
            const response = await this.http_client.get('/instruments', { query: options });
            resolve(new PageBuilder<InstrumentsGetResponse>(this.http_client, this.cache_layer).build(response));
        })
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}