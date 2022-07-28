# lemon.markets.js

This is a Javascript/Typescript SDK for the [lemon.markets](https://lemon.markets/) API.

## Versions
| sdk version | api version |
| - | - |
| 1.x | v1 |

## Getting started

### Get API Access
Follow the instructions on [lemon.markets](https://docs.lemon.markets/quickstart#getting-access).

### Install sdk
```sh
$ npm i lemon.markets.js
```

### Create new client
```ts
import lemon from 'lemon.markets.js'

const client = new lemon.Client({
    mode: 'paper',
    trading_key: 'your-api-key'
})
```

If you want to use `require`
```js
const lemon = require('lemon.markets.js').default;
```

# Documentation

* [Examples](#Examples)
* [Trading](#Trading)
    * [Account](#Account)
        * [Withdrawal](#Withdrawal)
        * [Bankstatement](#BankStatement)
        * [Document](#Document)
    * [Order](#Order)
        * [OrderConfirmation](#OrderConfirmation)
    * [Position](#Position)
        * [Statement](#Statement)
        * [Performance](#Performance)
* [Market Data](#MarketData)
    * [Instrument](#Instrument)
    * [Venue](#Venue)
    * [Quote](#Quote)
    * [OHLC](#OHLC)
    * [Trade](#Trade)
* [Realtime](#Realtime)
    * [RealtimeSubscription](#RealtimeSubscription)

## Examples

### List your positions with latest quote
```ts
async function main() {
    const positionsPage = await client.positions.get()
    const positions = positionsPage.values

    positions.forEach(async position => {
        const quote = (await client.quotes.latest({ isin: position.isin })).values[0]
        console.log(`${position.isin_title} @ ${quote.b}/${quote.a}`)
    })
}

main()
```

### Subscribe to realtime data
```ts
async function main() {
    const subscription = await client.realtime.subscribe({
        isin: 'US0378331005',
        callback: (data) => {
            console.log((data.a/10000).toFixed(2));
        }
    });
    // close subscription after 10 seconds
    setTimeout(() => {
        subscription.close();
    }, 10000);
}

main()
```

---
## ResponsePage
If you request too much data, your answer will be split into multiple pages.

| Name | Type | Description |
| - | - | - |
| page | number | |
| pages | number | |
| total | number | |
| previous | () => Promise\<ResponsePage\<T\>\> | |
| next | () => Promise\<ResponsePage\<T\>\> | |
| values | T[] | |

---
## Trading

---
### Account

| Name | Type | Description |
| - | - | - |
| account_id | string | |
| firstname | string | |
| lastname | string | |
| iban_brokerage | string | |
| iban_origin | string | |
| balance | number | |
| cash_to_invest | number | |
| cash_to_withdraw | number | |
| amount_bought_intraday | number | |
| amount_sold_intraday | number | |
| amount_open_orders | number | |
| amount_open_withdrawals | number | |
| amount_estimate_taxes | number | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| decimals? | boolean | Default: true |

```ts
const account: Account = await client.account.get()
```

Cache
```ts
const account: Account = client.account.cache()
```

---
### Withdrawal

| Name | Type | Description |
| - | - | - |
| id | string | |
| amount | string | |
| created_at | Date | |
| date | Date | |
| idempotency? | string | |

Get
<br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| limit? | number | |
| page? | number | |

```ts
const response: ResponsePage<Withdrawal> = await client.account.withdrawals.get()
const withdrawals: Withdrawal[] = response.values
```

Cache
```ts
const withdrawals: Withdrawal[] = client.account.withdrawals.cache()
```

Create
<br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| amount | number | |
| pin | number | |
| idempotency? | string |

```ts
const result: boolean = await client.account.withdrawals.create({ amount: 10, pin: 10 })
```

---
### BankStatement

| Name | Type | Description |
| - | - | - |
| id | string | |
| account_id | string | |
| type | 'pay_in' \| 'pay_out' \| 'order_buy' \| 'order_sell' \| 'eod_balance' \| 'dividend' \| 'tax_refunded' | |
| date | Date | |
| amount | number | |
| isin | string | |
| isin_title | string | |
| created_at | Date | |

Get
<br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| type? | 'pay_in' \| 'pay_out' \| 'order_buy' \| 'order_sell' \| 'eod_balance' \| 'dividend' \| 'tax_refunded' | |
| from? | string | |
| to? | string | |
| sorting? | 'asc' \| 'desc' | |
| limit? | number | |
| page? | number | |

```ts
const page: ResponsePage<BankStatement> = await client.account.bankstatements.get()
const bankstatements: BankStatement[] = page.values
```

Cache
```ts
const bankstatements: BankStatement[] = client.account.bankstatements.cache()
```

---
### Document

| Name | Type | Description |
| - | - | - |
| id | string | |
| name | string | |
| created_at | Date | |
| category | string | |
| link | string | |
| viewed_first_at | Date | |
| viewed_last_at | Date | |

Get
```ts
const page: ResponsePage<Document> = await client.account.documents.get()
const documents: Document[] = page.values
```

Cache
```ts
const documents: Document[] = client.account.documents.cache()
```

---
### Order

| Name | Type | Description |
| - | - | - |
| id | string | |
| isin | string | |
| isin_title | string | |
| expires_at | Date | |
| created_at | Date | |
| side | 'buy' \| 'sell' | |
| quantity | number | |
| stop_price | number | |
| limit_price | number | |
| estimated_price | number | |
| estimated_price_total | number | |
| venue | string | |
| status | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | |
| activate? | (options: { pin: number }) => Promise\<boolean\> | only if your order is inactive |

Create <br/>
<b>Params</b>

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| from? | string | |
| to? | string | |
| isin? | string | |
| side? | 'buy' \| 'sell' | |
| status? | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | |
| decimals? | boolean | Default: true |

```ts
const page: ResponsePage<Order> = await client.orders.get()
const orders: Order[] = page.values
```

Get one <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| orderId | string | |
| decimals? | boolean | Default: true |

```ts
const order: Order = await client.orders.getOne('order-id')
```

Cancel <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| orderId | string | |

```ts
const canceled: boolean = await client.orders.cancel('order-id')
```

Create <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string | |
| quantity | number | |
| side | 'buy' \| 'sell' | |
| venue | string | |
| expires_at? | 'day' \| Date | Default: 'day' |
| decimals? | boolean | Default: true |

```ts
const confirmation: OrderConfirmation = await client.orders.create({
    isin: 'US0378331005',
    side: 'buy',
    quantity: 10,
    venue: 'allday'
})
```

---
### OrderConfirmation
| Name | Type | Description |
| - | - | - |
| created_at | Date | |
| id | string | |
| status | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | |
| isin | string | |
| expires_at | Date | |
| side | 'buy' \| 'sell' | |
| quantity | number | |
| stop_price | number | |
| limit_price | number | |
| venue | string | |
| estimated_price | number | |
| charge | number | |
| activate | (options: { pin: number }) => Promise\<boolean\> | | 

Activate order
```ts
let confirmation: OrderConfirmation;
// create order ...
const activated: boolean = confirmation.activate({ pin: 1234 })
```

---
### Position

| Name | Type | Description |
| - | - | - |
| isin | string | |
| isin_title | string | |
| quantity | number | |
| buy_price_avg | number | |
| estimated_price_total | number | |
| estimated_price | number | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin? | string | |
| limit? | number | |
| page? | number | |
| decimals? | boolean | Default: true |

```ts
const page: ResponsePage<Position> = await client.positions.get()
const positions: Position[] = page.values
```

Cache <br/>

```ts
const positions: Position[] = client.positions.cache()
```

---
### Statement

| Name | Type | Description |
| - | - | - |
| id | string | |
| order_id | string | |
| external_id | string | |
| type | 'order_buy' \| 'order_sell' \| 'split' \| 'import' \| 'snx' | |
| quantity | number | |
| isin | string | |
| isin_title | string | |
| date | Date | |
| created_at | Date | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| type? | 'order_buy' \| 'order_sell' \| 'split' \| 'import' \| 'snx' | |
| limit? | number | |
| page? | number | |

```ts
const page: ResponsePage<Statement> = await client.positions.statements.get()
const statements: Statement[] = page.values
```

Cache <br/>

```ts
const statements: Statement[] = client.positions.statements.cache()
```

---
### Performance

| Name | Type | Description |
| - | - | - |
| isin | string | |
| isin_title | string | |
| profit | number | |
| loss | number | |
| quantity_bought | number | |
| quantity_sold | number | |
| quantity_open | number | |
| opened_at | Date | |
| closed_at | Date | |
| fees | number | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin? | string | |
| from? | string | |
| to? | string | |
| sorting? | 'asc' \| 'desc' | |
| limit? | number | |
| page? | number | |
| decimals? | boolean | Default: true |

```ts
const page: ResponsePage<Performance> = await client.positions.performances.get()
const performances: Performance[] = page.values
```

Cache <br/>

```ts
const performances: Performance[] = client.positions.performances.cache()
```

---
## MarketData

---
### Instrument

| Name | Type | Description |
| - | - | - |
| isin | string | |
| wkn | string | |
| name | string | |
| title | string | |
| symbol | string | |
| type | 'stock' \| 'etf' | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin? | string \| string[] | |
| search? | string | |
| type? | 'stock' \| 'etf' | |

```ts
const page: ResponsePage<Instrument> = await client.instruments.get()
const instruments: Instrument[] = page.values
```

Cache <br/>

```ts
const instruments: Instrument[] = client.instruments.cache()
```

---
### Venue

| Name | Type | Description |
| - | - | - |
| name | string | |
| title | string | |
| mic | string | |
| is_open | boolean | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| mic? | string | |
| limit? | number | |
| page? | number | |

```ts
const page: ResponsePage<Venue> = await client.venues.get()
const venues: Venue[] = page.values
```

Cache <br/>

```ts
const venues: Venue[] = client.venues.cache()
```

---
### Quote

| Name | Type | Description |
| - | - | - |
| isin | string | |
| b_v | number | |
| a_v | number | |
| b | number | |
| a | number | |
| t | Date | |
| mic | string | |

Latest <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string \| string[] | |
| mic? | string | |
| decimals? | boolean | Default: true |

```ts
const page: ResponsePage<Quote> = await client.quotes.latest({
    isin: 'US0378331005'
})
const quotes: Quote[] = page.values
```

---
### OHLC

| Name | Type | Description |
| - | - | - |
| isin | string | |
| o | number | |
| h | number | |
| l | number | |
| c | number | |
| v | number | |
| pbv | number | |
| t | Date | |
| mic | string | |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| x1 | 'm1' \| 'h1' \| 'd1' | |
| isin | string \| string[] | |
| mic? | string | |
| from? | string | |
| to? | string | |
| decimals? | boolean | Default: true |

```ts
const page: ResponsePage<OHLC> = await client.ohlc.get({
    x1: 'm1',
    isin: 'US0378331005'
})
const ohlc: OHLC[] = page.values
```

Cache <br/>

```ts
const ohlc: OHLC[] = client.ohlc.cache()
```

---
### Trade

| Name | Type | Description |
| - | - | - |
| isin | string | |
| p | number | |
| v | number | |
| t | Date | |
| mic | string | |

Latest <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string \| string[] | |
| mic? | string | |
| decimals? | boolean | Default: true |

```ts
const page: ResponsePage<Trade> = await client.trades.latest({
    isin: 'US0378331005',
})
const trades: Trade[] = page.values
```

---
## Realtime

---
### RealtimeSubscription

| Name | Type | Description |
| - | - | - |
| close | () => void | |

Subscribe <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string \| string[] | |
| callback | (data: Quote) => void | |
| allowOutOfOrder? | boolean | Default: false |

```ts
const subscription: RealtimeSubscription = await client.realtime.subscribe({
    isin: 'US0378331005',
    callback: (data: Quote) => {
        console.log(data)
    }
})
```