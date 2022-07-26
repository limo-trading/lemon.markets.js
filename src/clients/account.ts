import Client, { ClientOptions } from "../client";
import Withdrawals from "./account/withdrawals";
import BankStatements from "./account/bankstatements";
import Documents from "./account/documents";
import { Account } from "../types";

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

    public async get() {
        return new Promise<Account>(async resolve => {
            const response = await this.http_client.get("/account");
            this.cache_layer.setDefault(response.results);
            resolve(response.results);
        });
    }

    public cache() {
        return this.cache_layer.getDefault();
    }
}