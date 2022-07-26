import LemonError from './error';
import HttpClient from './http_client';
import Positions from './clients/positions';
import Quotes from './clients/quotes';
import Orders from './clients/orders';
import Account from './clients/account';
import Instruments from './clients/instruments';
import Venues from './clients/venues';
import Trades from './clients/trades';
import Realtime from './clients/realtime';
import OHLC from './clients/ohlc';

type trading_mode = 'paper' | 'live';

interface GeneralClientOptions {
    mode: trading_mode;
    tradingKey: string;
    dataKey?: string;
}

export default class LemonClient {

    private mode:trading_mode;
    private tradingKey:string;
    private dataKey:string;

    public positions: Positions;
    public quotes: Quotes;
    public orders: Orders;
    public account: Account;
    public instruments: Instruments;
    public venues: Venues;
    public trades: Trades;
    public realtime: Realtime;
    public ohlc: OHLC;

    constructor(options:GeneralClientOptions) {

        this.mode = options.mode;
        this.tradingKey = options.tradingKey;

        if(this.mode === 'paper') this.dataKey = options.tradingKey;
        else if(options.dataKey) this.dataKey = options.dataKey;
        else throw new LemonError('Market data API key is required. Use a paper trading key.');

        const tradingHttpClient = new HttpClient(`https://${this.mode === 'paper' ? 'paper-' : ''}trading.lemon.markets/v1`, this.tradingKey);
        const dataHttpClient = new HttpClient(`https://data.lemon.markets/v1`, this.dataKey);
        const realtimeHttpClient = new HttpClient(`https://realtime.lemon.markets/v1`, this.dataKey);

        this.positions = new Positions({ httpClient: tradingHttpClient });
        this.orders = new Orders({ httpClient: tradingHttpClient });
        this.account = new Account({ httpClient: tradingHttpClient });

        this.quotes = new Quotes({ httpClient: dataHttpClient });
        this.instruments = new Instruments({ httpClient: dataHttpClient });
        this.venues = new Venues({ httpClient: dataHttpClient });
        this.trades = new Trades({ httpClient: dataHttpClient });
        this.ohlc = new OHLC({ httpClient: dataHttpClient });

        this.realtime = new Realtime({ httpClient: realtimeHttpClient });
    }
}