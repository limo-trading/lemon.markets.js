export interface Account {
    account_id: string
    firstname: string
    lastname: string
    iban_brokerage: string
    iban_origin: string
    balance: number
    cash_to_invest: number
    cash_to_withdraw: number
    amount_bought_intraday: number
    amount_sold_intraday: number
    amount_open_orders: number
    amount_open_withdrawals: number
    amount_estimate_taxes: number
}

export interface LatestQuote {
    isin: string
    b_v: number
    a_v: number
    b: number
    a: number
    t: string
    mic: string
}

export interface Withdrawal {
    id: string
    amount: string
    created_at: string
    date: string
    idempotency: string
}