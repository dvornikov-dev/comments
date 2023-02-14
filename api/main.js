import server from './src/server/express.js';
import staticServer from './src/server/staticServer.js';
import 'dotenv/config';

server(process.env.PORT || 8000);
staticServer(process.env.STATIC_PORT);
