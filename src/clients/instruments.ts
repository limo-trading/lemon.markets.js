import Client, { ClientOptions } from "../client";
import ResponsePage, { toResponsePage } from "../response_page";

type InstrumentType = 'stock' | 'etf'

interface IntrumentsGetRequest {
    isin?: string | string[10];
    search?: string;
    type?: InstrumentType;
}

interface IntrumentsGetResponse {
    isin: string;
    wkn: string;
    name: string;
    title: string;
    symbol: string;
    type: InstrumentType;
}

export default class Instruments extends Client {
    
    constructor(options: ClientOptions) {
        super(options);
    }

    public get(options: IntrumentsGetRequest) {
        return new Promise<ResponsePage<IntrumentsGetResponse>>(async resolve => {
            const response = await this.http_client.get('/instruments', { query: options });
            resolve(toResponsePage(response, this.http_client));
        })
    }
}