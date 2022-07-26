import { Withdrawal } from "../src/types";
import client from "./client";

describe('test withdrawals route', () => {

    it('should withdraw', async() => {
        const res = await client.account.withdrawals.create({
            amount: 100,
            pin: 1234
        })
        expect(res).toBe(true)
    })

    let withdrawals: Withdrawal[];

    it('should get withdrawals', async() => {
        const res = await client.account.withdrawals.get()
        const values = res.values

        withdrawals = values

        expect(values.length).toBeGreaterThan(0)

        expect(values[0]).toHaveProperty('id')
        expect(values[0]).toHaveProperty('amount')
        expect(values[0]).toHaveProperty('date')
        expect(values[0]).toHaveProperty('idempotency')
    })

    it('should be cached', async() => {
        const cache = client.account.withdrawals.cache()
        expect(cache).toEqual(withdrawals)
    })
})