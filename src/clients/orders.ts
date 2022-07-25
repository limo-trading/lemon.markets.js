import HttpClient from "../http_client";
import ClientOptions from "./client_options";

interface ActivatedOrder {
    time: string
    mode: string
    status: string
}

interface Order {
    created_at: string
    id: string
    status: string
    isin: string
    expires_at: string
    side: 'buy' | 'sell'
    quantity: number
    stop_price: number
    limit_price: number
    venue: string
    estimated_price: number
    charge: number
    activate: (options: { pin: string }) => Promise<ActivatedOrder>
}

export default class Orders {

    private http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }

    public async create(options: {
        isin: string
        quantity: number
        expires_at?: 'day' | Date
        side: 'buy' | 'sell'
        venue: string
    }) {
        return new Promise<Order>(async resolve => {
            const expires_at = options.expires_at instanceof Date ? options.expires_at.toISOString() : 'p1d';
            const response = await this.http_client.post('/orders', { body: { ...options, expires_at } })
            resolve({
                activate: async (options: { pin: string }) => {
                    const activate_res = await this.http_client.post(`/orders/${response.results.id}/activate`, { body: options })
                    return activate_res
                }, 
                ...response,
            });
        })
    }
}