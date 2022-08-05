import client from "./client";
import { Performance } from "../src/index";

describe("test performance route", () => {

    let performance: Performance[];

    it("should get performance", async () => {
        const res = await client.positions.performance.get()
        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        performance = res.values

        expect(res.values[0]).toHaveProperty("isin")
        expect(res.values[0]).toHaveProperty("isin_title")
        expect(res.values[0]).toHaveProperty("profit")
        expect(res.values[0]).toHaveProperty("loss")
        expect(res.values[0]).toHaveProperty("quantity_bought")
        expect(res.values[0]).toHaveProperty("quantity_sold")
        expect(res.values[0]).toHaveProperty("quantity_open")
        expect(res.values[0]).toHaveProperty("opened_at")
        expect(res.values[0]).toHaveProperty("closed_at")
        expect(res.values[0]).toHaveProperty("fees")
    })

    it("should be cached", async () => {
        const cache = client.positions.performance.cache()
        expect(cache).toEqual(performance)
    })
})