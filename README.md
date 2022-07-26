# lemon.markets.js

## Versions
| sdk version | api version |
| - | - |
<<<<<<< HEAD
| ^1.x | v1 |
=======
| ^1.0.0 | v1 |

## Coverage

`⚠ NOTE: Completed routes can change to unfinished-state again. depends on the current development goals` <br/>
✅ Completed <br/>
❌ Not completed <br/>
➖ Will not be worked on <br/>

| method | path | covered | cache | documentation | tests |
| - | - | - | - | - | - |
| <b>Account</b> | | | | | |
| GET | /account | ✅ | ✅ | ❌ | ✅ |
| POST | /account/withdrawals | ✅ | ➖ | ❌ | ✅ |
| GET | /account/withdrawals | ✅ | ✅ | ❌ | ✅ |
| GET | /account/bankstatements | ✅ | ✅ | ❌ | ✅ |
| GET | /account/documents | ✅ | ✅ | ❌ | ✅ |
| <b>Orders</b> | | | | | |
| POST | /orders | ✅ | ➖ | ❌ | ❌ |
| POST | /orders/{order_id}/activate | ✅ | ➖ | ❌ | ❌ |
| GET | /orders | ✅ | ✅ | ❌ | ❌ |
| GET | /orders/{order_id} | ✅ | ✅ | ❌ | ❌ |
| DELETE | /orders/{order_id} | ✅ | ➖ | ❌ | ❌ |
| <b>Positions</b> | | | | |
| GET | /positions | ✅ | ✅ | ❌ | ❌ |
| GET | /positions/statements | ✅ | ✅ | ❌ | ❌ |
| GET | /positions/performance | ✅ | ✅ | ❌ | ❌ |
| <b>Market data</b> | | | | |
| GET | /instruments | ✅ | ✅ | ❌ | ❌ |
| GET | /venues | ✅ | ✅ | ❌ | ❌ |
| GET | /quotes/latest | ✅ | ➖ | ❌ | ❌ |
| GET | /ohlc/{x1} | ✅ | ✅ | ❌ | ❌ |
| GET | /trades/latest | ✅ | ➖ | ❌ | ❌ |
| <b>Realtime</b> | | | | |
| POST | /auth | ✅ | ➖ | ❌ | ❌ |
| - | ably_sdk | ✅ |  ➖ | ❌ | ❌ |
>>>>>>> 131ed03c9509870d87e54efe477d4585567ad402

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
