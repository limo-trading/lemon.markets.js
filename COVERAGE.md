✅ Completed <br/>
❌ Not completed <br/>
➖ Will not be worked on <br/>

| method | path | covered | cache | documentation | tests |
| - | - | - | - | - | - |
| <b>Account</b> | | | | | |
| GET | /account | ✅ | ✅ | ✅ | ✅ |
| POST | /account/withdrawals | ✅ | ➖ | ✅ | ✅ |
| GET | /account/withdrawals | ✅ | ✅ | ✅ | ✅ |
| GET | /account/bankstatements | ✅ | ✅ | ✅ | ✅ |
| GET | /account/documents | ✅ | ✅ | ✅ | ✅ |
| <b>Orders</b> | | | | | |
| POST | /orders | ✅ | ➖ | ✅ | ✅ |
| POST | /orders/{order_id}/activate | ✅ | ➖ | ✅ | ✅ |
| GET | /orders | ✅ | ✅ | ✅ | ✅ |
| GET | /orders/{order_id} | ✅ | ✅ | ✅ | ✅ |
| DELETE | /orders/{order_id} | ✅ | ➖ | ✅ | ✅ |
| <b>Positions</b> | | | | |
| GET | /positions | ✅ | ✅ | ❌ | ✅ |
| GET | /positions/statements | ✅ | ✅ | ❌ | ✅ |
| GET | /positions/performance | ✅ | ✅ | ❌ | ✅ |
| <b>Market data</b> | | | | |
| GET | /instruments | ✅ | ✅ | ❌ | ✅ |
| GET | /venues | ✅ | ✅ | ❌ | ✅ |
| GET | /quotes/latest | ✅ | ➖ | ❌ | ✅ |
| GET | /ohlc/{x1} | ✅ | ✅ | ❌ | ✅ |
| GET | /trades/latest | ✅ | ➖ | ❌ | ✅ |
| <b>Realtime</b> | | | | |
| POST | /auth | ✅ | ➖ | ❌ | ✅ |
| - | ably_sdk | ✅ |  ➖ | ❌ | ✅ |