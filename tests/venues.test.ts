import { Venue } from "../src/index";
import client from "./client";

describe("test venues route", () => {

    let venues: Venue[]

    it("should get venues", async () => {
        const res = await client.venues.get()
        expect(res).toHaveProperty("values")
        expect(res.values.length).toBeGreaterThan(0)

        venues = res.values

        expect(res.values[0]).toHaveProperty("name")
        expect(res.values[0]).toHaveProperty("title")
        expect(res.values[0]).toHaveProperty("mic")
        expect(res.values[0]).toHaveProperty("is_open")
    })

    it("should be cached", async () => {
        const cache = client.venues.cache()
        expect(cache).toEqual(venues)
    })
})