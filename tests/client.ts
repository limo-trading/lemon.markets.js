import lemon from '../src/index';
import { load } from 'ts-dotenv'

const env = load({
    LEMON_API_KEY: String
}, process.cwd() + '/tests/.env')

const client = new lemon.Client({
    mode: 'paper',
    tradingKey: env.LEMON_API_KEY,
});

export default client;