import lemon from './index';
import { load } from 'ts-dotenv';

const env = load({
    LEMON_API_KEY: String,
});

const client = new lemon.Client({
    mode: 'paper',
    trading_key: env.LEMON_API_KEY,
});

async function main(action: string) {
    switch(action) {
        case 'positions': displayPositions(); break;
        case 'orders': order(); break;
    }
}

async function order() {
    const order = await client.orders.create({
        isin: 'US0378331005',
        quantity: 30,
        expires_at: 'day',
        side: 'buy',
        venue: 'allday',
    });
    console.log(order);
    const result = await order.activate({ pin: '1234' })
    console.log(result);
}

async function displayPositions() {
    const positions = await client.positions.get();
    positions.values.forEach(async position => {
        const quote = await client.quotes.latest({ isin: position.isin });
        const avg_win = (quote.values[0].a - position.buy_price_avg/10000) * position.quantity;
        console.log(`\x1b[36m${position.quantity}x\x1b[0m \x1b[44m${position.isin_title}\x1b[0m ${avg_win > 0 ? '\x1b[32m+' : '\x1b[31m'}${avg_win.toFixed(2)}\x1b[0m \x1b[35m${position.isin}\x1b[0m`);
    })
}

main('positions');