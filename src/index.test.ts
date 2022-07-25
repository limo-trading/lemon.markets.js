import lemon from './index';
import { load } from 'ts-dotenv';

const env = load({
    LEMON_API_KEY: String,
});

const client = new lemon.Client({
    mode: 'paper',
    trading_key: env.LEMON_API_KEY,
});

async function main() {
    const positions = await client.positions.get();
    console.log(positions.values);
}

main();