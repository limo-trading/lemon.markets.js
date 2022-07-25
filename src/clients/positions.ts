import HttpClient from '../http_client';
import ClientOptions from './client_options';
import ResponsePage from './ReponsePage';

interface Request {
    isin?: string
    limit?: number
    page?: number
}

interface Response {
    isin: string
    isin_title: string
    quantity: number
    buy_price_avg: number
    estimated_price_total: number
    estimated_price: number
}

export default class Positions {

    private http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }

    public get(options?:Request) {
        return new Promise<ResponsePage<Response>>(async resolve => {
            const response = await this.http_client.get('/positions', { 'isin': options?.isin, 'limit': options?.limit, 'page': options?.page });
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