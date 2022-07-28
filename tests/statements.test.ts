import { Statement } from '../src/types';
import client from './client';

describe('test statements route', () => {

    let statements: Statement[];

    it('should get statements', async () => {
        const res = await client.positions.statements.get()
        expect(res).toHaveProperty('values')
        expect(res.values.length).toBeGreaterThan(0)

        statements = res.values

        expect(res.values[0]).toHaveProperty('id')
        expect(res.values[0]).toHaveProperty('order_id')
        expect(res.values[0]).toHaveProperty('external_id')
        expect(res.values[0]).toHaveProperty('type')
        expect(res.values[0]).toHaveProperty('quantity')
        expect(res.values[0]).toHaveProperty('isin')
        expect(res.values[0]).toHaveProperty('isin_title')
        expect(res.values[0]).toHaveProperty('date')
        expect(res.values[0]).toHaveProperty('created_at')
    })

    it('should be cached', async () => {
        const cache = client.positions.statements.cache()
        expect(cache).toEqual(statements)
    })
})