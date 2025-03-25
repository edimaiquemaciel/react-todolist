const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./data/db.json'); // Lê o db.json da raiz
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

// Exporta para o Vercel
module.exports = server;