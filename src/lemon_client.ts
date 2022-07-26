import LemonError from './error';
import HttpClient from './http_client';
import Positions from './clients/positions';
import Quotes from './clients/quotes/quotes';
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
    trading_key: string;
    data_key?: string;
}

export default class LemonClient {

    private mode:trading_mode;
    private trading_key:string;
    private data_key:string;

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
        this.trading_key = options.trading_key;

        if(this.mode === 'paper') this.data_key = options.trading_key;
        else if(options.data_key) this.data_key = options.data_key;
        else throw new LemonError('Market data API key is required. Use a paper trading key.');

        const trading_http_client = new HttpClient(`https://${this.mode === 'paper' ? 'paper-' : ''}trading.lemon.markets/v1`, this.trading_key);
        const data_http_client = new HttpClient(`https://data.lemon.markets/v1`, this.data_key);
        const realtime_http_client = new HttpClient(`https://realtime.lemon.markets/v1`, this.data_key);

        this.positions = new Positions({ http_client: trading_http_client });
        this.orders = new Orders({ http_client: trading_http_client });
        this.account = new Account({ http_client: trading_http_client });

        this.quotes = new Quotes({ http_client: data_http_client });
        this.instruments = new Instruments({ http_client: data_http_client });
        this.venues = new Venues({ http_client: data_http_client });
        this.trades = new Trades({ http_client: data_http_client });
        this.ohlc = new OHLC({ http_client: data_http_client });

        this.realtime = new Realtime({ http_client: realtime_http_client });
    }
}