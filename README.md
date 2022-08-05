# lemon.markets.js

This is a Javascript/Typescript SDK for the [lemon.markets](https://lemon.markets/) API.

## Versions
| sdk version | api version |
| - | - |
| 1.x | v1 |

### Node.js Version
lemon.markets.js is build for `Node.js v17.x`.
Older versions may be supported, but not tested and some features may not work.
Known issues:
* Dates in Cache are strings, not Date objects.

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
* [Numbers](#Numbers)
    * [Quantities](#Quantities)
    * [Currencies](#Currencies)
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
## Numbers

### Quantities
If you want to enter a quantity (e.g. when you place an order and want to specify how many stocks you want to buy), you can simply enter the "normal" quantity you want to buy or sell --> "quantity" = 1 will result in you buying 1 stock.

### Currencies
If you set "decimals" to be false, then the price must be specified as a hundredth of a cent (e.g. 15000 == 1.50€).
By default "decimals" is true and the price is specified as "normal" (e.g. 1.50 == 1.50€).

---
## ResponsePage
If you request too much data, your response will be split into multiple pages.

| Name | Type | Description |
| - | - | - |
| page | number | Current page number |
| pages | number | Total number of pages |
| total | number | Total number of results |
| previous | () => Promise\<ResponsePage\<T\>\> | Function to fetch the previous page |
| next | () => Promise\<ResponsePage\<T\>\> | Function to fetch the next page |
| values | T[] | Results |

---
## Trading

---
### Account

| Name | Type | Description |
| - | - | - |
| account_id | string | Unique Identification number for your account |
| firstname | string | Your first name |
| lastname | string | Your last name |
| iban_brokerage | string | IBAN of the brokerage account at the partner bank |
| iban_origin | string | IBAN of the reference account |
| balance | number | This is your account balance |
| cash_to_invest | number | This number shows you how much cash you have left to invest |
| cash_to_withdraw | number | This number shows you how much cash you have in your account to withdraw to your reference account |
| amount_bought_intraday | number | This is the intraday buy order amount |
| amount_sold_intraday | number | This is the intraday sell order amount |
| amount_open_orders | number | This is the intraday amount of open orders |
| amount_open_withdrawals | number | This is the intraday amount of withdrawals |
| amount_estimate_taxes | number | This is the amount of estimated taxes (25%) for your intraday sell orders |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| id | string | A unique Identification Number of your withdrawal |
| amount | string | The amount that you specified for your withdrawal. |
| created_at | Date | Date at which you created the withdrawal |
| date | Date | Date at which the withdrawal was processed by the partner bank |
| idempotency? | string | Your own unique idempotency key that you specified in your POST request to prevent duplicate withdrawals. |

Get
<br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| limit? | number | This parameter is required to influence the Pagination. Use it to define the limit of displayed results on one page. The default value is 10, the maximum number is 100. |
| page? | number | This parameter is required to influence the Pagination. Use it to define the specific results page you wish to display. |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| amount | number | Amount you wish to withdraw.  |
| pin | number | This is the personal verification PIN you set during the onboarding. |
| idempotency? | string | You can set your own unique idempotency key to prevent duplicate operations. Subsequent requests with the same idempotency key will then not go through and throw an error message. This means you cannot make the same withdrawal twice. |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

```ts
const result: boolean = await client.account.withdrawals.create({ amount: 10, pin: 10 })
```

---
### BankStatement

| Name | Type | Description |
| - | - | - |
| id | string | Unique Identification Number of your bank statement |
| account_id | string | Unique Identification Number of the account the bank statement is related to |
| type | 'pay_in' \| 'pay_out' \| 'order_buy' \| 'order_sell' \| 'eod_balance' \| 'dividend' \| 'tax_refunded' | Type of bank statement |
| date | Date | The date that the bank statement relates to |
| amount | number | The amount associated with the bank statement.  |
| isin | string | The International Securities Identification Number (ISIN) related to your bank statement. Only for type order_buy and order_sell, otherwise null |
| isin_title | string | The title of the International Securities Identification Number (ISIN) related to your bank statement. Only for type order_buy and order_sell, otherwise null |
| created_at | Date | The Date the bank statement was created internally. This can be different to the date, e.g., when there is a weekend in between. |

Get
<br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| type? | 'pay_in' \| 'pay_out' \| 'order_buy' \| 'order_sell' \| 'eod_balance' \| 'dividend' \| 'tax_refunded' | Filter for different types of bank statements |
| from? | Date | Filter for bank statements after a specific date |
| to? | Date | Filter for bank statements until a specific date |
| sorting? | 'asc' \| 'desc' | Use asc_ to sort your bank statements in ascending order (oldest ones first), or desc to sort your bank statements in descending order (newest ones first). |
| limit? | number | This parameter is required to influence the Pagination. Use it to define the limit of displayed results on one page. The default value is 10, the maximum number is 100. |
| page? | number | This parameter is required to influence the Pagination. Use it to define the specific results page you wish to display. |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| id | string | The unique Identification Number for the document |
| name | string | The name of the Document |
| created_at | Date | Date at which the Document was created internally |
| category | string | The Document Category |
| link | string | A Link to download a Document PDF |
| viewed_first_at | Date | Date at which the Document was first viewed (downloaded) |
| viewed_last_at | Date | Date at which the Document was last viewed (downloaded) |

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
| id | string | This is the unique Order Identification Number |
| isin | string | This is the International Security Identification Number (ISIN) for the instrument bough or sold with this Order |
| isin_title | string | This is the Title of the instrument bought or sold with this order |
| expires_at | Date | This is the Date at which the Order expires |
| created_at | Date | This is the Date at which the Order was created |
| side | 'buy' \| 'sell' | This is the side of an order |
| quantity | number | This is the number of Instruments specified in the Order |
| stop_price | number | This is the Stop Price defined for the Order. "null" if Stop Price is not set.  |
| limit_price | number | This is the Limit Price defined for the Order. "null" if Stop Price is not set.  |
| estimated_price | number | This is the Estimated Price the Order will be executed at (only for Market Orders).  |
| estimated_price_total | number | This is the Estimated Price the Order will be executed at (only for Market Orders), multiplied by the Order quantity.  |
| venue | string | This is the Market Identifier Code of the Trading Venue the Order was placed at |
| status | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | This is the Order Status |
| activate? | (options: { pin: number }) => Promise\<boolean\> | Activate your Order if it is inactive. See [here](#OrderConfirmation) for more informations |

Create <br/>
<b>Params</b>

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| from? | Date | Specify a Date to get only orders from a specific date on |
| to? | Date | Specify a Date to get only orders until a specific date |
| isin? | string | Use this to only see orders from a specific instrument |
| side? | 'buy' \| 'sell' | Filter to either only see "buy" or "sell" orders |
| status? | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | Filter for status|
| stop_price? | number | Use this attribute to define a Stop Price for your Order |
| limit_price? | number | Use this attribute to define a Limit Price for your Order |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

```ts
const page: ResponsePage<Order> = await client.orders.get()
const orders: Order[] = page.values
```

Get one <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| orderId | string | This is the unique Identification Number of the Order you want to retrieve |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

```ts
const order: Order = await client.orders.getOne('order-id')
```

Cancel <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| orderId | string | Unique Identification Number of the order you wish to cancel |

```ts
const canceled: boolean = await client.orders.cancel('order-id')
```

Create <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string | This is the International Security Identification Number that uniquely identifies the instrument you wish to buy or sell |
| quantity | number | Use this attribute to define the number of shares you want to buy. This is limited to 25,000€ estimated order price per request |
| side | 'buy' \| 'sell' | Use this attribute to define whether you want to buy ('buy') or sell ('sell') a specific instrument |
| venue | string | Use this attribute to specify the Market Identifier Code (MIC) of the stock exchange you want to place the order at. Use "allday" for 24/7 order exeution (only in the Paper Money environment). The order is then executed at the last saved quote. |
| expires_at? | 'day' \| Date | Use this attribute to specify when you want your order to expire. The Maximum expiration date is 30 days in the future. When limit_price and/or stop_price are set, the expires_at parameter is required. For a market order, the expires_at parameter is optional. In the case of a market order, the default value is the end of the same day. Default is day |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| created_at | Date | Date for when the order was created |
| id | string | This is the unique Order Identification Number. |
| status | 'inactive' \| 'active' \| 'open' \| 'in_progress' \| 'canceling' \| 'executed' \| 'canceled' \| 'expired' | This is the status the Order is currently in |
| isin | string | This is the International Securities Identification Number of the instrument specified in that order |
| expires_at | Date | Date until when the order is valid |
| side | 'buy' \| 'sell' | This is the side of an order |
| quantity | number | This is the amount of instruments specified in the order |
| stop_price | number | This is the Stop price for the order. "null" if not specified.  |
| limit_price | number | This is the Limit price for the order. "null" if not specified.  |
| venue | string | This is the Market Identifier Code of the trading venue the order was placed at (default is XMUN) |
| estimated_price | number | This is an estimation from the lemon.markets end for what price the order will be executed.  |
| charge | number | This is the charge for the placed order.  |
| activate | (options: { pin: number }) => Promise\<boolean\> | If you want to activate a paper money order or are interested in building your own 2FA experience you can use this function | 

Activate order <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| pin | number | You need to set a PIN in the request body to activate an order. If you want to activate a real money order, use the 4-digit PIN you set during your onboarding process. If you want to activate a paper money order you can use any random 4-digit PIN or send the request without request body. |

```ts
let confirmation: OrderConfirmation;
// create order ...
const activated: boolean = confirmation.activate({ pin: 1234 })
```

---
### Position

| Name | Type | Description |
| - | - | - |
| isin | string | This is the International Securities Identification Number (ISIN) of the position |
| isin_title | string | This is the Title of the instrument |
| quantity | number | This is the number of positions you currently hold for the respective Instrument |
| buy_price_avg | number | This is the average buy-in price of the respective position. If you buy one share for 100€ and a second one for 110€, the average buy-in price would be 105€ |
| estimated_price_total | number | This is the current position valuation to the market trading price. So, if you own 3 shares of stock XYZ, and the current market trading price for XYZ is 100€, this attribute would return 300€ |
| estimated_price | number | This is the current market trading price for the respective position |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin? | string | Use this parameter to filter for a specific Instrument in your positions using the instrument's ISIN |
| limit? | number | This parameter is required to influence the Pagination. Use it to define the limit of displayed results on one page. The default value is 10, the maximum number is 100 |
| page? | number | This parameter is required to influence the Pagination. Use it to define the specific results page you wish to display |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| id | string | This is the unique Identification Number for the statement |
| order_id | string | This is the unique Identification Number for the related order (if type = order_buy or order_sell, otherwise null) |
| external_id | string | If you imported a position from an external source, lemon.markets provides the external identification number here |
| type | 'order_buy' \| 'order_sell' \| 'split' \| 'import' \| 'snx' | This is the type of statement that tells you about the type of change that happened to your position |
| quantity | number | This is the quantity related to the position statement |
| isin | string | This is the ISIN of the Instrument that is affected in the statement |
| isin_title | string | This is the Title of the Instrument that is affected in the statement |
| date | Date | This is the Date the statement occurs at |
| created_at | Date | Date for when the statement is processed by us internally. It can be the case that lemon.markets receives data 1-3 days later. So, for example when a position change occurs on a Friday afternoon, lemon.markets only receives the data on Monday morning. Therefore, date would then be date of the Friday, while created_at is a date from Monday morning. |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| type? | 'order_buy' \| 'order_sell' \| 'split' \| 'import' \| 'snx' | Filter for a specific type of Statement |
| limit? | number | Required for Pagination. Limit of displayed results on one page |
| page? | number | Required for Pagination. Results page you wish to display |

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
| isin | string | This is the ISIN of the respective position |
| isin_title | string | This is the Title of the respective position |
| profit | number | This shows a profit when all or parts of the respective position were sold for more than they were bought for. Otherwise 0 |
| loss | number | This shows a loss when all or parts of the respective position were sold for less than they were bought for. Otherwise 0 |
| quantity_bought | number | This shows how many position shares were bought over specific time period |
| quantity_sold | number | This shows how many position shares were sold over specific time period |
| quantity_open | number | This shows the number of open position shares |
| opened_at | Date | This show the specific date for when the position was opened (first share(s) were bought) |
| closed_at | Date | This show the specific date for when the position was closed (last share(s) were sold) |
| fees | number | This shows the amount of fees for orders related to the respective position |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin? | string | Filter for a specific instrument in your positions |
| from? | Date | Get position performances from a specific date on. If "from" is not specified, the API returns the last 30 days by default |
| to? | Date | Get position performances until specific date on |
| sorting? | 'asc' \| 'desc' | Use "asc" to sort your position performances in ascending order and "desc" to sort your position performances in descending order |
| limit? | number | Required for Pagination. Limit of displayed results on one page |
| page? | number | Required for Pagination. Results page you wish to display |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| isin | string | This is the International Securities Identification Number (ISIN) of the instrument |
| wkn | string | This is the German Securities Identification Number of instrument |
| name | string | This is the Instrument name |
| title | string | This is the Instrument Title |
| symbol | string | This is the Symbol of the instrument at the trading venue |
| type | 'stock' \| 'etf' | This tells you about the type of instrument. Not all types are mentioned in the lemon.markets docs |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin? | string \| string[] | Use this parameter to specify the Instrument you are interested in through its International Securities Identification Number. You can also specify multiple ISINs |
| type? | 'stock' \| 'etf' \| string | Use this parameter to specify the type of instrument you want to filter for. Not all types are mentioned in the lemon.markets docs |

```ts
const page: ResponsePage<Instrument> = await client.instruments.get()
const instruments: Instrument[] = page.values
```

Search <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| query | string | Use this parameter to search for Name/Title, ISIN, WKN or symbol. You can also perform a partial search by only specifiying the first 4 symbols |
| type? | 'stock' \| 'etf' \| string | Not all types are mentioned in the lemon.markets docs |

Cache <br/>

```ts
const instruments: Instrument[] = client.instruments.cache()
```

---
### Venue

| Name | Type | Description |
| - | - | - |
| name | string | This is the Full Name of the Trading Venue |
| title | string | This is the Short Title of the Trading Venue |
| mic | string | This is the Market Identifier Code (MIC) of the Trading Venue |
| is_open | boolean | This indicates if the Trading Venue is currently open |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| mic? | string | Enter a Market Identifier Code (MIC) in there |
| limit? | number | This parameter is required to influence the Pagination. Use it to define the limit of displayed results on one page.
The default value is 100, the maximum number is 250 |
| page? | number | This parameter is required to influence the Pagination. Use it to define the specific results page you wish to display |

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
| isin | string | This is the International Securities Identification Number of the instrument you requested the quotes for |
| b_v | number | This is the Bid Volume for the Quote |
| a_v | number | This is the Ask Volume for the Quote |
| b | number | This is the Bid price for the Quote |
| a | number | This is the Ask price for the Quote |
| t | Date | This is the date the Quote occured at |
| mic | string | This is the Market Identifier Code of the Trading Venue the Quote occured at |

Latest <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string \| string[] | Use the International Securities Identification Number to filter for a specific instrument you want to get the quotes for |
| mic? | string | Use the Market Identifier Code to filter for a specific Trading Venue |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| isin | string | This is the International Securities Identification Number of the instrument you requested the OHLC data for |
| o | number | This is the Open Price in the specific time period |
| h | number | This is the Highest Price in the specific time period |
| l | number | This is the Lowest Price in the specific time period |
| c | number | This is the Close Price in the specific time period |
| v | number | This is the aggegrated volume (Number of trades) of the instrument in the specific time period |
| pbv | number | This is the Price by Volume (Sum of (quantity * last price)) of the instrument in the specific time period |
| t | Date | The date of the beginning of the represented time interval |
| mic | string | This is the Market Identifier Code of the Trading Venue the OHLC data occured at |

Get <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| x1 | 'm1' \| 'h1' \| 'd1' | Specify the type of data you wish to retrieve: m1 (per minute), h1 (per hour), or d1 (per day) |
| isin | string \| string[] | Use the International Securities Identification Number (ISIN) to filter for the instrument you want to get the OHLC data for |
| mic? | string | Use the Market Identifier Code to filter for a specific Trading Venue |
| from? | string | Start of time range you want to get OHLC data for. For D1 data, you can request 60 days of data with one request, therefore the time range between from and to cannot be longer than 60 days. If to is not defined, the API automatically returns data until the current day or up to 60 days, based on the from date. For H1 and M1 data, you can request historical data for one day, therefore the time range between from and to cannot be longer than 1 day |
| to? | string | End of time range you want to get OHLC data for. For D1 data, you can request 60 days of data with one request, therefore the time range between from and to cannot be longer than 60 days. If to is not defined, the API automatically returns data until the current day or up to 60 days, based on the from date. For H1 and M1 data, you can request historical data for one day, therefore the time range between from and to cannot be longer than 1 day. |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

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
| isin | string | This is the International Securities Identification Number of the instrument you requested the trades for |
| p | number | This is the Price the trade happened at |
| v | number | This is the Volume for the trade (quantity) |
| t | Date | This is the Timestamp the trade occured at |
| mic | string | This is the Market Identifier Code of the Trading Venue the trade occured at |

Latest <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string \| string[] | The International Securities Identification Number of the instrument you want to get the trades for. You can also specify multiple ISINs |
| mic? | string | Enter a Market Identifier Code (MIC) in there |
| decimals? | boolean | Specify the numbers format you want to get your response in. Default is true |

```ts
const page: ResponsePage<Trade> = await client.trades.latest({
    isin: 'US0378331005',
})
const trades: Trade[] = page.values
```

---
## Realtime
Info: If no data is sent, the exchange may be closed.

---
### RealtimeSubscription

| Name | Type | Description |
| - | - | - |
| close | () => void | A function to close the subscription |

Subscribe <br/>
<b>Params</b>
| Name | Type | Description |
| - | - | - |
| isin | string \| string[] | The International Securities Identification Number of the instrument you want to get the quotes for. You can also specify multiple ISINs |
| callback | (data: Quote) => void | The callback function is called when new quotes are received |
| allowOutOfOrder? | boolean | Specify the numbers format you want to get your response in. Default is true |

```ts
const subscription: RealtimeSubscription = await client.realtime.subscribe({
    isin: 'US0378331005',
    callback: (data: Quote) => {
        console.log(data)
    }
})
```

Or to receive realtime data without exposing your API key.

```ts
// backend (API key is required)
const auth - await client.realtime.auth()
// frontend (API key is not required)
const realtime = new lemon.Realtime(auth)
const subscription = realtime.subscribe({
    isin: 'US0378331005',
    callback: (data: Quote) => {
        console.log(data)
    }
})
```