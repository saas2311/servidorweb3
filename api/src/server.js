import http from 'http';
import {manipuladorDeRotas} from './routes.js';
import { json } from './middlewares/json.js';


const server = http.createServer(async (request, response) => {
    await json(request, response);
    manipuladorDeRotas(request, response);
});

server.listen(3000, () => {
    console.log('API rodando na porta 3000');
});