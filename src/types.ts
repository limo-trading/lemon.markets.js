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

export interface Quote {
    isin: string
    b_v: number
    a_v: number
    b: number
    a: number
    t: Date
    mic: string
}

export interface Withdrawal {
    id: string
    amount: string
    created_at: Date
    date: Date
    idempotency: string
}

export type BankStatementType = 'pay_in' | 'pay_out' | 'order_buy' | 'order_sell' | 'eod_balance' | 'dividend' | 'tax_refunded'

export interface BankStatement {
    id: string
    account_id: string
    type: BankStatementType
    date: Date
    amount: number
    isin: string
    isin_title: string
    created_at: Date
}

export interface Document {
    id: string
    name: string
    created_at: Date
    category: string
    link: string
    viewed_first_at: Date
    viewed_last_at: Date
}

export type OrderStatus = 'inactive' | 'active' | 'open' | 'in_progress' | 'canceling' | 'executed' | 'canceled' | 'expired'

export interface Order {
    id: string
    isin: string
    isin_title: string
    expires_at: Date
    created_at: Date
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
    created_at: Date
    id: string
    status: OrderStatus
    isin: string
    expires_at: Date
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

export type StatementType = 'order_buy' | 'order_sell' | 'split' | 'import' | 'snx'

export interface Statement {
    id: string
    order_id: string
    external_id: string
    type: StatementType
    quantity: string
    isin: string
    isin_title: string
    date: Date
    created_at: Date
}

export interface Performance {
    isin: string
    isin_title: string
    profit: number
    loss: number
    quantity_bought: number
    quantity_sold: number
    quantity_open: number
    opened_at: Date
    closed_at: Date
    fees: number
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

export interface Venue {
    name: string
    title: string
    mic: string
    is_open: boolean
}

export interface Trade {
    isin: string
    p: number
    v: number
    t: Date
    mic: string
}

export interface OHLC {
    isin: string
    o: number
    h: number
    l: number
    c: number
    v: number
    pbv: number
    t: Date
    mic: string
}

export interface RealtimeSubscription {
    close: () => void
}

export interface ResponsePage<T> {
    page: number
    pages: number
    total: number
    previous: () => Promise<ResponsePage<T>>
    next: () => Promise<ResponsePage<T>>
    values: T[]
}