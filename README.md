# lemon.markets.js

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

## Trading
### Positions
Get all positions
```ts
const page = await client.positions.get()
const positions = page.values
```

Allowed Params:
| Key | Type | Description |
| - | - | - |
| isin | string | Use this parameter to filter for a specific Instrument in your positions using the instrument's ISIN |
| limit | int | This parameter is required to influence the Pagination. Use it to define the limit of displayed results on one page. The default value is 10, the maximum number is 100. |
| page | int | This parameter is required to influence the Pagination. Use it to define the specific results page you wish to display.|

<span color='red'>* required</span>

### Create Order
```ts
const order = await client.orders.create({
    isin: US88160R1014,
    quantity: 1,
    expires_at: 'day',
    side: 'buy',
    venue: 'allday'
})
```

### Activate Order
```ts
const result = await order.activate({ pin: '1234' })
```

### Account
```ts
const account = await client.account.get()
```

### Orders
Get all orders
```ts
const page = await client.orders.get()
const orders = page.values
```

## Market Data

### Latest
Get latest data
```ts
const page = await client.quotes.latest({ 'isin': 'US88160R1014' })
const latest = page.values[0]
```

Allowed Params:
| Key | Type | Description |
| - | - | - |
| isin<span color='red'>*</span> | string \| string[] | Use the International Securities Identification Number to filter for a specific instrument you want to get the quotes for. Maximum 10 ISINs per request. |
| mic | string | Use the Market Identifier Code to filter for a specific Trading Venue. Currently, only <b>XMUN</b> is supported. |

<span color='red'>* required</span>