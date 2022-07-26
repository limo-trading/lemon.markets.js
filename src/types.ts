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

export type BankStatementType = 'pay_in' | 'pay_out' | 'order_buy' | 'order_sell' | 'eod_balance' | 'dividend' | 'tax_refunded'

export interface BankStatement {
    id: string
    account_id: string
    type: BankStatementType
    date: string
    amount: number
    isin: string
    isin_title: string
    created_at: string
}

export interface Document {
    id: string
    name: string
    created_at: string
    category: string
    link: string
    viewed_first_at: string
    viewed_last_at: string
}

export type OrderStatus = 'inactive' | 'active' | 'open' | 'in_progress' | 'canceling' | 'executed' | 'canceled' | 'expired'

export interface Order{
    id: string
    isin: string
    isin_title: string
    expires_at: string
    created_at: string
    side: 'buy' | 'sell'
    quantity: number
    stop_price: number
    limit_price: number
    estimated_price: number
    estimated_price_total: number
    venue: string
    status: OrderStatus
}

export interface OrderConfirmation {
    created_at: string
    id: string
    status: string
    isin: string
    expires_at: string
    side: 'buy' | 'sell'
    quantity: number
    stop_price: number
    limit_price: number
    venue: string
    estimated_price: number
    charge: number
    activate: (options: { pin: number }) => Promise<boolean>
}

export interface Position {
    isin: string
    isin_title: string
    quantity: number
    buy_price_avg: number
    estimated_price_total: number
    estimated_price: number
}

export type InstrumentType = 'stock' | 'etf'

export interface Instrument {
    isin: string;
    wkn: string;
    name: string;
    title: string;
    symbol: string;
    type: InstrumentType;
}