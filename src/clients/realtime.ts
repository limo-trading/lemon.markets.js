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
    errorCallback?: (error: string) => void
}

export default class RealtimeClient extends Client<Quote> {

    private authCache: Cache<RealtimeAuth>;
    private connectionCache: Cache<Ably.Realtime>;
    private subscriptionsCache: Cache<RealtimeSubscription>

    constructor(options: ClientOptions) {
        super(options);

        this.authCache = new Cache();
        this.connectionCache = new Cache();
        this.subscriptionsCache = new Cache();
    }

    private generateAuth() {
        return new Promise<RealtimeAuth>(async resolve => {
            const response = await this.httpClient.post('/auth');
            this.cacheLayer.set('auth', response);
            resolve(response);
        })
    }

    public subscribe(options: RealtimeSubscribeParams) {
        return new Promise<RealtimeSubscription>(async (resolve, reject) => {

            options.errorCallback = (error: string) => reject(error);

            const auth = this.authCache.getDefault()
                ? this.authCache.getDefault().expires_at < Date.now()
                    ? await this.generateAuth() : this.authCache.getDefault() : await this.generateAuth();

            const connection = this.connectionCache.getDefault() || new Ably.Realtime({
                token: auth.token,
                transportParams: { remainPresentFor: 1000 },
                authCallback: async (_, callback) => {
                    const newAuth = await this.generateAuth();
                    callback('', newAuth.token);
                }
            })

            if(!this.subscriptionsCache.getDefault()) this.subscriptionsCache.setDefault(await new Realtime(auth, connection).subscribe(options));
            const subscription = this.subscriptionsCache.getDefault();

            resolve(subscription);
        })
    }

    public auth() {
        const cache = this.authCache.getDefault();
        if (cache && cache.expires_at > Date.now()) return cache;
        return this.generateAuth();
    }
}

export class Realtime {

    private connection: Ably.Realtime;
    private auth: RealtimeAuth;

    private lastQuote: Quote | undefined;

    constructor(auth: RealtimeAuth, connection?: Ably.Realtime) {
        this.auth = auth;
        this.connection = connection || new Ably.Realtime({
            token: auth.token,
            transportParams: { remainPresentFor: 1000 },
            authCallback: async (_, callback) => {
                callback('cannot generate new token', '');
            }
        })
    }

    public subscribe(options: RealtimeSubscribeParams) {
        return new Promise<RealtimeSubscription>(async (resolve, reject) => {
            const decimals = options.decimals ?? true;

            const quotes = this.connection.channels.get(this.auth.user_id);
            const subscriptions = this.connection.channels.get(`${this.auth.user_id}.subscriptions`);

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
                        if (!this.lastQuote || this.lastQuote.t?.getTime() < quote.t.getTime()) {
                            this.lastQuote = quote;
                            options.callback(quote);
                        }
                        break;
                    default:
                        break;
                }
            })

            subscriptions.publish('isins', typeof options.isin === 'string' ? options.isin : options.isin.join(','), err => {
                if(err) {
                    if(!options.errorCallback) return console.log(err.message);
                    return options.errorCallback?.(err.message);
                }
            });

            resolve({
                close: () => {
                    return new Promise<void>(resolveClose => {
                        quotes.detach((err) => reject(err));
                        subscriptions.detach((err) => reject(err));
                        this.connection.close();
                        resolveClose()
                    })
                }
            });
        })
    }
}