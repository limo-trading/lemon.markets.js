import Client, { ClientOptions } from "../client";
import Withdrawals from "./account/withdrawals";
import BankStatements from "./account/bankstatements";
import Documents from "./account/documents";
import { Account } from "../index";
import { convertNumber } from "../number_dates";

interface AccountGetParams {
    decimals?: boolean
}

export default class AccountClient extends Client<Account> {

    public withdrawals: Withdrawals;
    public bankstatements: BankStatements;
    public documents: Documents;

    constructor(options: ClientOptions) {
        super(options);

        this.withdrawals = new Withdrawals(options);
        this.bankstatements = new BankStatements(options);
        this.documents = new Documents(options);
    }

    public async get(options?: AccountGetParams) {
        return new Promise<Account>(async resolve => {
            const response = await this.httpClient.get("/account");
            this.cacheLayer.setDefault(response.results);
            const account: Account = response.results

            const decimals = options?.decimals ?? true;
            resolve({
                ...account,
                balance: convertNumber(account.balance, decimals),
                cash_to_invest: convertNumber(account.cash_to_invest, decimals),
                cash_to_withdraw: convertNumber(account.cash_to_withdraw, decimals),
            });
        });
    }

    public cache(options?: { decimals?: boolean }) {
        const decimals = options?.decimals ?? true;
        const cache = this.cacheLayer.getDefault()
        return {
            ...cache,
            balance: convertNumber(cache.balance, decimals),
            cash_to_invest: convertNumber(cache.cash_to_invest, decimals),
            cash_to_withdraw: convertNumber(cache.cash_to_withdraw, decimals),
        }
    }
}