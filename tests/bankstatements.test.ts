import { BankStatement } from '../src/index';
import client from './client';

describe('test bankstatements route', () => {
    
    let bankstatements: BankStatement[];

    it('should get bankstatements', async () => {
        const res = await client.account.bankstatements.get()
        expect(res).toHaveProperty('values')
        expect(res.values.length).toBeGreaterThan(0)
        
        bankstatements = res.values
        
        expect(res.values[0]).toHaveProperty('id')
        expect(res.values[0]).toHaveProperty('account_id')
        expect(res.values[0]).toHaveProperty('type')
        expect(res.values[0]).toHaveProperty('date')
        expect(res.values[0]).toHaveProperty('amount')
        expect(res.values[0]).toHaveProperty('isin')
        expect(res.values[0]).toHaveProperty('isin_title')
        expect(res.values[0]).toHaveProperty('created_at')

    })

    it('should be cached', async () => {
        const cache = client.account.bankstatements.cache()
        expect(cache).toEqual(bankstatements)
    })
})