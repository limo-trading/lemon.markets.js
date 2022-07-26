import client from "./client";

describe("test quotes route", () => {

    it("should get latest quote of aaple and coinbase", async () => {
        const res = await client.quotes.latest({ isin: ['US0378331005', 'US19260Q1076'] })
        
        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        expect(res.values[0]).toHaveProperty("isin")
        expect(res.values[0]).toHaveProperty("b_v")
        expect(res.values[0]).toHaveProperty("a_v")
        expect(res.values[0]).toHaveProperty("b")
        expect(res.values[0]).toHaveProperty("a")
        expect(res.values[0]).toHaveProperty("t")
        expect(res.values[0]).toHaveProperty("mic")

    })
})