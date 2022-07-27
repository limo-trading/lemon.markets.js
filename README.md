# lemon.markets.js

## Versions
| sdk version | api version |
| - | - |
| 1.x | v1 |

## Getting started

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

# Documentation

* [Trading](#Trading)
    * [Account](#Account)
        * [Withdrawal](#Withdrawal)
        * [Bankstatement](#BankStatement)
        * [Document](#Document)
    * [Order](#Order)
        * [OrderConfirmation](#OrderConfirmation)

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

Get
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
| id? | string | |
| amount? | string | |
| created_at? | string | |
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
| date | string | |
| amount | number | |
| isin | string | |
| isin_title | string | |
| created_at | string | |

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
| created_at | string | |
| category | string | |
| link | string | |
| viewed_first_at | string | |
| viewed_last_at | string | |

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
| expires_at | string | |
| created_at | string | |
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

```ts
const page: ResponsePage<Order> = await client.orders.get()
const orders: Order[] = page.values
```

Get one <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| orderId | string | |

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
| created_at | string | |
| id | string | |
| status | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | |
| isin | string | |
| expires_at | string | |
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