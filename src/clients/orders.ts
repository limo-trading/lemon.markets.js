import HttpClient from "../http_client";
import Client, { ClientOptions } from "../client";
import ResponsePage, { PageBuilder } from "../response_page";

type OrderStatus = 'inactive' | 'active' | 'open' | 'in_progress' | 'canceling' | 'executed' | 'canceled' | 'expired'

interface ActivateRequest {
    pin: bigint
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
    activate: (options: { pin: string }) => Promise<boolean>
}

interface OrderGetRequest {
    order_id?: string
    from?: string
    to?: string
    isin?: string
    side?: 'buy' | 'sell'
    status?: OrderStatus
}

interface OrderGetResponse {
    id: string
    isin: string
    isin_title: string
    expires_at: string
    created_at: string
    side: 'buy' | 'sell'
    quantity: bigint
    stop_price: bigint
    limit_price: bigint
    estimated_price: bigint
    estimated_price_total: bigint
    venue: string
    status: OrderStatus
}

const activateFunction = async(options: ActivateRequest, id: string, http_client: HttpClient) => {
    return new Promise<boolean>(async resolve => {
        const activate_res = await http_client.post(`/orders/${id}/activate`, { body: options })
        if(activate_res.status === 'ok') resolve(true);
        else resolve(false);
    })
}

export default class Orders extends Client<OrderGetResponse> {

    constructor(options: ClientOptions) {
        super(options);
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
                activate: (options: ActivateRequest) => activateFunction(options, response.results.id, this.http_client),
                ...response.results,
            });
        })
    }

    private getOne(order_id: string) {
        return new Promise<OrderGetResponse>(async resolve => {
            const response = await this.http_client.get(`/orders/${order_id}`)
            this.cache_layer.set(response.results[0].id, response.results)
            resolve({
                activate: response.results.status === 'inactive' ? (options: ActivateRequest) => activateFunction(options, response.results.id, this.http_client) : undefined,
                ...response.results[0],
            })
        })
    }

    public get(options?: OrderGetRequest) {
        if(options?.order_id) return this.getOne(options.order_id);
        return new Promise<ResponsePage<OrderGetResponse>>(async resolve => {
            const response = await this.http_client.get('/orders', { query: options })
            // add activate method to each inactive order
            const orders = response.results.map((order: OrderGetResponse) => ({
                activate: order.status === 'inactive' ? (options: ActivateRequest) => activateFunction(options, order.id, this.http_client) : undefined,
                ...order,
            }))
            response.results = orders;
            resolve(new PageBuilder(this.http_client, this.cache_layer).build(response))
        })
    }

    public cancel(order_id: string) {
        return new Promise<boolean>(async resolve => {
            const response = await this.http_client.delete(`/orders/${order_id}`)
            resolve(response.status === 'ok')
        })
    }

    public cache() {
        return this.cache_layer.getAll();
    }
}