import { Order, OrderConfirmation } from '../src/index';
import client from './client';

describe('test orders route', () => {
    
    let order: OrderConfirmation

    it('should order aapl', async () => {

        const res = await client.orders.create({
            isin: 'US0378331005',
            side: 'buy',
            quantity: 10,
            venue: 'allday'
        })

        order = res

        expect(res).toHaveProperty('created_at')
        expect(res).toHaveProperty('id')
        expect(res).toHaveProperty('status')
        expect(res).toHaveProperty('isin')
        expect(res).toHaveProperty('expires_at')
        expect(res).toHaveProperty('side')
        expect(res).toHaveProperty('quantity')
        expect(res).toHaveProperty('stop_price')
        expect(res).toHaveProperty('limit_price')
        expect(res).toHaveProperty('venue')
        expect(res).toHaveProperty('estimated_price')
        expect(res).toHaveProperty('charge')
        expect(res).toHaveProperty('activate')

    })

    it('should activate order', async () => {
        const res = await order.activate({
            pin: 1234
        })
        expect(res).toBe(true)
    })

    it('should get order', async () => {

        const res = await client.orders.getOne({
            id: order.id
        })

        expect(res).toHaveProperty('id')
        expect(res).toHaveProperty('isin')
        expect(res).toHaveProperty('isin_title')
        expect(res).toHaveProperty('expires_at')
        expect(res).toHaveProperty('created_at')
        expect(res).toHaveProperty('side')
        expect(res).toHaveProperty('quantity')
        expect(res).toHaveProperty('stop_price')
        expect(res).toHaveProperty('limit_price')
        expect(res).toHaveProperty('estimated_price')
        expect(res).toHaveProperty('estimated_price_total')
        expect(res).toHaveProperty('venue')
        expect(res).toHaveProperty('status')

    })

    let orders: Order[]

    it('should get orders', async () => {

        const res = await client.orders.get()

        expect(res).toHaveProperty('values')
        expect(res.values.length).toBeGreaterThan(0)

        orders = res.values

        expect(res.values[0]).toHaveProperty('id')
        expect(res.values[0]).toHaveProperty('isin')
        expect(res.values[0]).toHaveProperty('isin_title')
        expect(res.values[0]).toHaveProperty('expires_at')
        expect(res.values[0]).toHaveProperty('created_at')
        expect(res.values[0]).toHaveProperty('side')
        expect(res.values[0]).toHaveProperty('quantity')
        expect(res.values[0]).toHaveProperty('stop_price')
        expect(res.values[0]).toHaveProperty('limit_price')
        expect(res.values[0]).toHaveProperty('estimated_price')
        expect(res.values[0]).toHaveProperty('estimated_price_total')
        expect(res.values[0]).toHaveProperty('venue')
        expect(res.values[0]).toHaveProperty('status')

    })

    it('should be cached', async () => {
        const cache = client.orders.cache()
        expect(cache).toEqual(orders)
    })

    it('should cancel order', async () => {
        const res = await client.orders.create({
            isin: 'US0378331005',
            side: 'buy',
            quantity: 10,
            venue: 'allday'
        })
        const cancelRes = await client.orders.cancel(res.id)
        expect(cancelRes).toBe(true)
    })
})