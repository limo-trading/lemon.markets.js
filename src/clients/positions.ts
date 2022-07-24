import HttpClient from '../http_client';
import ClientOptions from './client_options';

interface Request {
    isin: string
    limit: number
    page: number
}

interface Response{
    isin: string
    isin_title: string
    quantity: bigint
    buy_price_avg: bigint
    estimated_price_total: bigint
    estimated_price: bigint
}

export default class Positions {

    private http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }

    public get(options?:Request) {
        return new Promise<Response>(async (resolve, reject) => {
            const response = await this.http_client.get('/positions', { body: options });
            if(response.status === 200) {
                const data = await response.json();
                resolve(data);
            } else {
                reject(new Error(`${response.status} ${response.statusText}`));
            }
        })
    }
}