import HttpClient from "../http_client";
import Client, { ClientOptions } from "../client";
import { PageBuilder } from "../response_page";
import { Order, OrderConfirmation, OrderStatus, ResponsePage } from "../index";
import { convertDate, convertNumber, formatDate } from "../number_dates";

interface ActivateParams {
    pin: number
}

interface OrderCreateParams {
    isin: string
    quantity: number
    expires_at?: 'day' | Date
    side: 'buy' | 'sell'
    venue: string
    stop_price?: number
    limit_price?: number
    decimals?: boolean
}

interface OderGetOneParams {
    id: string
    decimals?: boolean
}

interface OrderGetParams {
    from?: Date
    to?: Date
    isin?: string
    side?: 'buy' | 'sell'
    status?: OrderStatus
    decimals?: boolean
}


const activateFunction = async(options: ActivateParams, id: string, httpClient: HttpClient) => {
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

    public async create(options: OrderCreateParams) {
        return new Promise<OrderConfirmation>(async resolve => {
            const decimals = options.decimals ?? true;
            options.limit_price = convertNumber(options.limit_price!, decimals);
            options.stop_price = convertNumber(options.stop_price!, decimals);

            const expiresAt = options.expires_at instanceof Date ? options.expires_at.toISOString() : 'p1d';
            const response = await this.httpClient.post('/orders', { body: { ...options, expiresAt } })

            resolve({
                ...response.results,
                created_at: convertDate(response.results.created_at),
                expires_at: convertDate(response.results.expires_at),
                stop_price: convertNumber(response.results.stop_price, decimals),
                limit_price: convertNumber(response.results.limit_price, decimals),
                estimated_price: convertNumber(response.results.estimated_price, decimals),
                estimated_price_total: convertNumber(response.results.estimated_price_total, decimals),
                charge: convertNumber(response.results.charge, decimals),
                activate: activateOptions => activateFunction(activateOptions, response.results.id, this.httpClient),
            });
        })
    }

    public getOne(options: OderGetOneParams) {
        return new Promise<Order>(async resolve => {
            const response = await this.httpClient.get(`/orders/${options.id}`)
            this.cacheLayer.set(response.results.id, response.results)
            const order = response.results

            const decimals = options.decimals ?? true;

            resolve({
                ...order,
                expires_at: convertDate(order.expires_at),
                created_at: convertDate(order.created_at),
                stop_price: convertNumber(order.stop_price, decimals),
                limit_price: convertNumber(order.limit_price, decimals),
                estimated_price: convertNumber(order.estimated_price, decimals),
                estimated_price_total: convertNumber(order.estimated_price_total, decimals),
                activate: order.status === 'inactive' ? (activateOptions: ActivateParams) => activateFunction(activateOptions, order.id, this.httpClient) : undefined,
            })
        })
    }

    public get(options?: OrderGetParams) {
        return new Promise<ResponsePage<Order>>(async resolve => {
            const response = await this.httpClient.get('/orders', {
                query: {
                    ...options,
                    from: options?.from ? formatDate(options?.from) : undefined,
                    to: options?.to ? formatDate(options?.to) : undefined,
                }
            })

            const decimals = options?.decimals ?? true;
            resolve(new PageBuilder(this.httpClient, this.cacheLayer)
            .build({
                res: response,
                override: (data: any) => ({
                    ...data,
                    expires_at: convertDate(data.expires_at),
                    created_at: convertDate(data.created_at),
                    stop_price: convertNumber(data.stop_price, decimals),
                    limit_price: convertNumber(data.limit_price, decimals),
                    estimated_price: convertNumber(data.estimated_price, decimals),
                    estimated_price_total: convertNumber(data.estimated_price_total, decimals),
                    activate: data.status === 'inactive' ? (activateOptions: ActivateParams) => activateFunction(activateOptions, data.id, this.httpClient) : undefined,
                })
            }))
        })
    }

    public cancel(orderId: string) {
        return new Promise<boolean>(async resolve => {
            const response = await this.httpClient.delete(`/orders/${orderId}`)
            resolve(response.status === 'ok')
        })
    }

    public cache(options?: { decimals?: boolean }) {
        const decimals = options?.decimals ?? true;
        return this.cacheLayer.getAll().map(data => ({
            ...data,
            stop_price: convertNumber(data.stop_price, decimals),
            limit_price: convertNumber(data.limit_price, decimals),
            estimated_price: convertNumber(data.estimated_price, decimals),
            estimated_price_total: convertNumber(data.estimated_price_total, decimals),
        }))
    }
}