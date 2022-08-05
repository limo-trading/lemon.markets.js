import { RealtimeSubscription } from "../src/index";
import client from "./client";

describe("test realtime", () => {

    let subscription: RealtimeSubscription

    jest.setTimeout(10000)

    it('should subscribe to realtime', () => {
        return new Promise<void>(async resolve => {
            const res = await client.realtime.subscribe({
                isin: "US0378331005",
                callback: (data) => { 

                    expect(res).toHaveProperty('close')

                    expect(data).toHaveProperty('isin')
                    expect(data).toHaveProperty('b_v')
                    expect(data).toHaveProperty('a_v')
                    expect(data).toHaveProperty('b')
                    expect(data).toHaveProperty('a')
                    expect(data).toHaveProperty('t')
                    expect(data).toHaveProperty('mic')

                    res.close()

                    resolve()
                }
            })

            subscription = res
        })
    })

    it('should unsubscribe from realtime', () => {
        subscription.close()
    })
})