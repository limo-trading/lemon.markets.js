export interface Account {
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