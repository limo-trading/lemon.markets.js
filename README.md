# lemon.markets.js

## Versions
| sdk version | api version |
| - | - |
| ^1.x | v1 |

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

* [Trading](#Trading)
    * [Account](#Account)
        * [Withdrawal](#Withdrawal)
        * [Bankstatement](#BankStatement)
        * [Document](#Document)


# Documentation

## ResponsePage
If your requested data is too large, it is split across multiple pages.

| Name | Type | Description |
| - | - | - |
| page | number | |
| pages | number | |
| total | number | |
| previous | () => Promise\<ResponsePage\<T\>\> | |
| next | () => Promise\<ResponsePage\<T\>\> | |
| values | T[] | |

## Trading
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

---

Get
```ts
const account: Account = await client.account.get()
```

---

Cache
```ts
const account: Account = client.account.cache()
```

### Withdrawal

| Name | Type | Description |
| - | - | - |
| id | string | |
| amount | string | |
| created_at | string | |
| idempotency | string | |

---
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

---

Cache
```ts
const withdrawals: Withdrawal[] = client.account.withdrawals.cache()
```

---

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

---

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

---

Cache
```ts
const bankstatements: BankStatement[] = client.account.bankstatements.cache()
```

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

---

Get
```ts
const page: ResponsePage<Document> = await client.account.documents.get()
cosnt documents: Document[] = page.values
```

---

Cache
```ts
const documents: Document[] = client.account.documents.cache()
```
