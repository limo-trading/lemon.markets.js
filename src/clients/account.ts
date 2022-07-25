import HttpClient from "../http_client";
import ClientOptions from "./client_options";

interface AccountResponse {
    account_id: string
    firstname: string
    lastname: string
    iban_brokerage: string
    iban_origin: string
    balance: bigint
    cash_to_invest: bigint
    cash_to_withdraw: bigint
    amount_bought_intraday: bigint
    amount_sold_intraday: bigint
    amount_open_orders: bigint
    amount_open_withdrawals: bigint
    amount_estimate_taxes: bigint
}

export default class Account {

    private http_client: HttpClient;

    constructor(options: ClientOptions) {
        this.http_client = options.http_client;
    }

    public async get() {
        return new Promise<AccountResponse>(async resolve => {
            const response = await this.http_client.get("/account");
            resolve(response.results);
        });
    }
}