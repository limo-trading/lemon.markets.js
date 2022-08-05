import { Position } from "../src/index";
import client from "./client";

describe("test positions route", () => {

    let positions: Position[];

    it("should get positions", async () => {
        const res = await client.positions.get()
        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        positions = res.values

        expect(res.values[0]).toHaveProperty("isin")
        expect(res.values[0]).toHaveProperty("isin_title")
        expect(res.values[0]).toHaveProperty("quantity")
        expect(res.values[0]).toHaveProperty("buy_price_avg")
        expect(res.values[0]).toHaveProperty("estimated_price_total")
        expect(res.values[0]).toHaveProperty("estimated_price")

    });

    it("should be cached", async () => {
        const cache = client.positions.cache()
        expect(cache).toEqual(positions)
    });

})