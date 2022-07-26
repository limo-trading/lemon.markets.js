import client from "./client";

describe("test trades route", () => {

    it("should get latest trades", async () => {
        const res = await client.trades.latest({ isin: ['US0378331005', 'US19260Q1076'] })

        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        expect(res.values[0]).toHaveProperty("isin")
        expect(res.values[0]).toHaveProperty("p")
        expect(res.values[0]).toHaveProperty("v")
        expect(res.values[0]).toHaveProperty("t")
        expect(res.values[0]).toHaveProperty("mic")

    })
})