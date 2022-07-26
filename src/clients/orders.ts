import HttpClient from "../http_client";
import Client, { ClientOptions } from "../client";
import ResponsePage, { PageBuilder } from "../response_page";

type OrderStatus = 'inactive' | 'active' | 'open' | 'in_progress' | 'canceling' | 'executed' | 'canceled' | 'expired'

interface ActivateRequest {
    pin: number
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
    quantity: number
    stop_price: number
    limit_price: number
    estimated_price: number
    estimated_price_total: number
    venue: string
    status: OrderStatus
}

const activateFunction = async(options: ActivateRequest, id: string, httpClient: HttpClient) => {
    return new Promise<boolean>(async resolve => {
        const activateRes = await httpClient.post(`/orders/${id}/activate`, { body: options })
        if(activateRes.status === 'ok') resolve(true);
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
            const expiresAt = options.expires_at instanceof Date ? options.expires_at.toISOString() : 'p1d';
            const response = await this.httpClient.post('/orders', { body: { ...options, expiresAt } })
            resolve({
                activate: (activateOptions: ActivateRequest) => activateFunction(activateOptions, response.results.id, this.httpClient),
                ...response.results,
            });
        })
    }

    private getOne(orderId: string) {
        return new Promise<OrderGetResponse>(async resolve => {
            const response = await this.httpClient.get(`/orders/${orderId}`)
            this.cacheLayer.set(response.results[0].id, response.results)
            resolve({
                activate: response.results.status === 'inactive' ? (options: ActivateRequest) => activateFunction(options, response.results.id, this.httpClient) : undefined,
                ...response.results[0],
            })
        })
    }

    public get(options?: OrderGetRequest) {
        if(options?.order_id) return this.getOne(options.order_id);
        return new Promise<ResponsePage<OrderGetResponse>>(async resolve => {
            const response = await this.httpClient.get('/orders', { query: options })
            // add activate method to each inactive order
            const orders = response.results.map((order: OrderGetResponse) => ({
                activate: order.status === 'inactive' ? (activateOptions: ActivateRequest) => activateFunction(activateOptions, order.id, this.httpClient) : undefined,
                ...order,
            }))
            response.results = orders;
            resolve(new PageBuilder(this.httpClient, this.cacheLayer).build(response))
        })
    }

    public cancel(orderId: string) {
        return new Promise<boolean>(async resolve => {
            const response = await this.httpClient.delete(`/orders/${orderId}`)
            resolve(response.status === 'ok')
        })
    }

    public cache() {
        return this.cacheLayer.getAll();
    }
}