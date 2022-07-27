import HttpClient from "../http_client";
import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Order, OrderConfirmation, OrderStatus, ResponsePage } from "../types";

interface ActivateRequest {
    pin: number
}

interface OrderCreateRequest {
    isin: string
    quantity: number
    expires_at?: 'day' | Date
    side: 'buy' | 'sell'
    venue: string
}

interface OrderGetRequest {
    from?: string
    to?: string
    isin?: string
    side?: 'buy' | 'sell'
    status?: OrderStatus
}


const activateFunction = async(options: ActivateRequest, id: string, httpClient: HttpClient) => {
    return new Promise<boolean>(async resolve => {
        const activateRes = await httpClient.post(`/orders/${id}/activate`, { body: options })
        if(activateRes.status === 'ok') resolve(true);
        else resolve(false);
    })
}

export default class OrdersClient extends Client<Order> {

    constructor(options: ClientOptions) {
        super(options);
    }

    public async create(options: OrderCreateRequest) {
        return new Promise<OrderConfirmation>(async resolve => {
            const expiresAt = options.expires_at instanceof Date ? options.expires_at.toISOString() : 'p1d';
            const response = await this.httpClient.post('/orders', { body: { ...options, expiresAt } })
            resolve({
                activate: (activateOptions: ActivateRequest) => activateFunction(activateOptions, response.results.id, this.httpClient),
                ...response.results,
            });
        })
    }

    public getOne(orderId: string) {
        return new Promise<Order>(async resolve => {
            const response = await this.httpClient.get(`/orders/${orderId}`)
            this.cacheLayer.set(response.results.id, response.results)
            resolve({
                activate: response.results.status === 'inactive' ? (options: ActivateRequest) => activateFunction(options, response.results.id, this.httpClient) : undefined,
                ...response.results,
            })
        })
    }

    public get(options?: OrderGetRequest) {
        return new Promise<ResponsePage<Order>>(async resolve => {
            const response = await this.httpClient.get('/orders', { query: options })
            // add activate method to each inactive order
            const orders = response.results.map((order: Order) => ({
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