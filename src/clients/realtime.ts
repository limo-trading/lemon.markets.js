import Client, { ClientOptions } from "../client";
import * as Ably from 'ably';
import Cache from '../cache';
import { Quote, RealtimeSubscription, RealtimeAuth } from "../types";
import { convertDate, convertNumber } from "../number_dates";

interface RealtimeSubscribeParams {
    isin: string | string[]
    callback: (data: Quote) => void
    allowOutOfOrder?: boolean
    decimals?: boolean
}

export default class RealtimeClient extends Client<Quote> {

    private authCache: Cache<RealtimeAuth>;
    private connectionCache: Cache<Ably.Realtime>;
    private quotesCache: Cache<Ably.Types.RealtimeChannelCallbacks>
    private subscriptionsCache: Cache<Ably.Types.RealtimeChannelCallbacks>

    constructor(options: ClientOptions) {
        super(options);

        this.authCache = new Cache();
        this.connectionCache = new Cache();
        this.quotesCache = new Cache();
        this.subscriptionsCache = new Cache();
    }

    private auth() {
        return new Promise<RealtimeAuth>(async resolve => {
            const response = await this.httpClient.post('/auth');
            this.cacheLayer.set('auth', response);
            resolve(response);
        })
    }

    public subscribe(options: RealtimeSubscribeParams) {
        return new Promise<RealtimeSubscription>(async (resolve, reject) => {

            const decimals = options.decimals ?? true;

            const auth = this.authCache.getDefault()
                ? this.authCache.getDefault().expires_at < Date.now()
                    ? await this.auth() : this.authCache.getDefault() : await this.auth();

            const connection = this.connectionCache.getDefault() || new Ably.Realtime({
                token: auth.token,
                transportParams: { remainPresentFor: 1000 },
                authCallback: async (_, callback) => {
                    const newAuth = await this.auth();
                    callback('', newAuth.token);
                }
            })

            const quotes = this.quotesCache.getDefault() || connection.channels.get(auth.user_id);
            const subscriptions = this.subscriptionsCache.getDefault() || connection.channels.get(`${auth.user_id}.subscriptions`);

            quotes.subscribe((message) => {
                const { name, data } = message;
                switch (name) {
                    case 'quotes':

                        const quote: Quote = {
                            ...data,
                            a: convertNumber(data.a, decimals),
                            b: convertNumber(data.b, decimals),
                            t: convertDate(data.t),
                        }

                        if (options.allowOutOfOrder) return options.callback(quote);

                        // check if quote is newer than last quote
                        const lastQuote = this.cacheLayer.get(quote.isin) || {};
                        if (lastQuote.t?.getTime() < quote.t.getTime()) {
                            this.cacheLayer.set(quote.isin, quote);
                            options.callback(quote);
                        }
                        break;
                    default:
                        break;
                }
            })

            subscriptions.publish('isins', typeof options.isin === 'string' ? options.isin : options.isin.join(','), err => {
                reject(err)
            });

            resolve({
                close: () => {
                    return new Promise<void>(resolveClose => {
                        quotes.detach((err) => reject(err));
                        subscriptions.detach((err) => reject(err));
                        connection.close();
                        resolveClose()
                    })
                }
            });
        })
    }
}