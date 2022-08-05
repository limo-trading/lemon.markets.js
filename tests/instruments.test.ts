import { Instrument } from "../src/index";
import client from "./client";

describe("test instruments route", () => {

    let instruments: Instrument[];

    it("should get instruments aapl", async () => {
        const res = await client.instruments.get({ isin: "US0378331005" })
        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        instruments = res.values

        expect(res.values[0]).toHaveProperty("isin")
        expect(res.values[0]).toHaveProperty("wkn")
        expect(res.values[0]).toHaveProperty("name")
        expect(res.values[0]).toHaveProperty("title")
        expect(res.values[0]).toHaveProperty("symbol")
        expect(res.values[0]).toHaveProperty("type")
    })

    it("should be cached", async () => {
        const cache = client.instruments.cache()
        expect(cache).toEqual(instruments)
    })
})