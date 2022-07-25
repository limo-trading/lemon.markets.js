import HttpClient from "../../http_client";
import ClientOptions from "../client_options";
import ResponsePage from "../ReponsePage";

interface LatestResponse {
    isin: string
    b_v: number
    a_v: number
    b: number
    a: number
    t: string
    mic: string
}

export default class Quotes {

    private http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }

    public async latest(options: { isin: string, mic?: string }) {
        return new Promise<ResponsePage<LatestResponse>>(async resolve => {
            const response = await this.http_client.get('/quotes/latest', { 'isin': options.isin, 'mic': options.mic });
            resolve({
                mode: response.mode,
                page: response.page,
                pages: response.pages,
                total: response.total,
                previous: () => {
                    if(response.previous) this.http_client.external_fetch(response.previous);
                },
                next: () => {
                    if(response.next) this.http_client.external_fetch(response.next);
                },
                values: response.results,
            });
        })
    }
}