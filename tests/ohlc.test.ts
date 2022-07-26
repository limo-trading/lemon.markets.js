import { OHLC } from "../src/types";
import client from "./client";

describe("test ohlc route", () => {

    let ohlc: OHLC[];

    it("should get ohlc", async () => {
        const res = await client.ohlc.get({
            isin: "US0378331005",
            x1: "m1"
        })
        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        ohlc = res.values

        expect(res.values[0]).toHaveProperty("isin")
        expect(res.values[0]).toHaveProperty("o")
        expect(res.values[0]).toHaveProperty("h")
        expect(res.values[0]).toHaveProperty("l")
        expect(res.values[0]).toHaveProperty("c")
        expect(res.values[0]).toHaveProperty("v")
        expect(res.values[0]).toHaveProperty("pbv")
        expect(res.values[0]).toHaveProperty("t")
        expect(res.values[0]).toHaveProperty("mic")
    })

    it("should be cached", async () => {
        const cache = client.ohlc.cache()
        expect(cache).toEqual(ohlc)
    })
})