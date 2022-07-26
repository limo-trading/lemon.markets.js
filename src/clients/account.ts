import Client, { ClientOptions } from "./client";
import Withdrawals from "./withdrawals";

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

export default class Account extends Client {

    public withdrawals: Withdrawals;

    constructor(options: ClientOptions) {
        super(options);
        this.withdrawals = new Withdrawals(options);
    }

    public async get() {
        return new Promise<AccountResponse>(async resolve => {
            const response = await this.http_client.get("/account");
            resolve(response.results);
        });
    }

    // TODO: GET /account/bankstatements
    // TODO: GET /account/documents
}