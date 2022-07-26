import Client, { ClientOptions } from "../client";
import * as Ably from 'ably';
import Cache from '../cache';
import { LatestQuote } from "../@types/trades";

interface RealtimeSubscribeRequest {
    isin: string | string[];
    callback: (data: LatestQuote) => void;
}

interface RealtimeAuthResponse {
    token: string
    expires_at: number
    user_id: string
}

export default class Realtime extends Client<LatestQuote> {

    private auth_cache: Cache<RealtimeAuthResponse>;
    private connection_cache: Cache<Ably.Realtime>;
    private quotes_cache: Cache<Ably.Types.RealtimeChannelCallbacks>
    private subscriptions_cache: Cache<Ably.Types.RealtimeChannelCallbacks>

    constructor(options: ClientOptions) {
        super(options);

        this.auth_cache = new Cache();
        this.connection_cache = new Cache();
        this.quotes_cache = new Cache();
        this.subscriptions_cache = new Cache();
    }

    private auth() {
        return new Promise<RealtimeAuthResponse>(async resolve => {
            const response = await this.http_client.post('/auth');
            this.cache_layer.set('auth', response);
            resolve(response);
        })
    }

    public subscribe(options: RealtimeSubscribeRequest) {
        return new Promise<boolean>(async (resolve, reject) => {

            const auth = this.auth_cache.getDefault()
                ? this.auth_cache.getDefault().expires_at < Date.now()
                ? await this.auth() : this.auth_cache.getDefault() : await this.auth();

            const connection = this.connection_cache.getDefault() || new Ably.Realtime({
                token: auth.token,
                transportParams: { remainPresentFor: 1000 },
                authCallback: async(_, callback) => {
                    const auth = await this.auth();
                    callback('', auth.token);
                }
            })

            const quotes = this.quotes_cache.getDefault() || connection.channels.get(auth.user_id);
            const subscriptions = this.subscriptions_cache.getDefault() || connection.channels.get(`${auth.user_id}.subscriptions`);

            quotes.subscribe((message) => {
                const { name, data } = message;
                switch(name) {
                    case 'quotes':
                        const last_quote = this.cache_layer.get(data.isin) || {};
                        // check if quote is newer than last quote
                        if(new Date(last_quote.t || 0).getTime() < new Date(data.t).getTime()) {
                            this.cache_layer.set(data.isin, data);
                            options.callback(data);
                        }
                        break;
                    default:
                        break;
                }
            })

            subscriptions.publish('isins', typeof options.isin === 'string' ? options.isin : options.isin.join(','), err => {
                reject(err)
            });

            resolve(true);
        })
    }
}