import LemonError from './error';
import HttpClient from './http_client';
import Positions from './clients/positions';

type trading_mode = 'paper' | 'live';

interface GeneralClientOptions {
    mode: trading_mode;
    trading_key: string;
    data_key?: string;
}

export default class Client {

    private mode:trading_mode;
    private trading_key:string;
    private data_key:string;

    public positions: Positions;

    constructor(options:GeneralClientOptions) {
        this.mode = options.mode;
        this.trading_key = options.trading_key;

        if(this.mode === 'paper') this.data_key = options.trading_key;
        else if(options.data_key) this.data_key = options.data_key;
        else throw new LemonError('Market data API key is required. Use a paper trading key.');

        const trading_http_client = new HttpClient(this.mode, this.trading_key);
        const data_http_client = new HttpClient(this.mode, this.data_key);

        this.positions = new Positions({ http_client: trading_http_client });
    }
}