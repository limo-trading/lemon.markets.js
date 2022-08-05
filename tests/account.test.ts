import { Account } from '../src/index';
import client from './client'

describe('test account route', () => {

    let account: Account;

    it('should return account', async () => {
        const res = await client.account.get()
        
        account = res

        expect(res).toHaveProperty('account_id')
        expect(res).toHaveProperty('firstname')
        expect(res).toHaveProperty('lastname')
        expect(res).toHaveProperty('iban_brokerage')
        expect(res).toHaveProperty('iban_origin')
        expect(res).toHaveProperty('balance')
        expect(res).toHaveProperty('cash_to_invest')
        expect(res).toHaveProperty('cash_to_withdraw')
        expect(res).toHaveProperty('amount_bought_intraday')
        expect(res).toHaveProperty('amount_sold_intraday')
        expect(res).toHaveProperty('amount_open_orders')
        expect(res).toHaveProperty('amount_open_withdrawals')
        expect(res).toHaveProperty('amount_estimate_taxes')
    })

    it('should be cached', async () => {
        const cache = client.account.cache()
        expect(cache).toEqual(account)
    })
})