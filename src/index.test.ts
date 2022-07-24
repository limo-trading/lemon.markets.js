import lemon from './index';

const client = new lemon.Client({
    mode:'paper',
    trading_key:'123',
});

async function main() {
    const positions = await client.positions.get();
    console.log(positions);
}

main();