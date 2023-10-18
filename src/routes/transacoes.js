const express = require('express');
const routes = express.Router();

const transacoesControllers = require('../controllers/transacoes');

const tokensMiddlewares = require('../middlewares/tokens');

routes.use(tokensMiddlewares.verificarToken);

routes.get('/transacao', transacoesControllers.listarTransacoes);
routes.get('/transacao/extrato', transacoesControllers.obterExtratoTransacao)
routes.get('/transacao/:id', transacoesControllers.detalharTransacao);
routes.post('/transacao', transacoesControllers.cadastrarTransacao);
routes.put('/transacao/:id', transacoesControllers.atualizarTransacao);
routes.delete('/transacao/:id', transacoesControllers.excluirTransacao);

module.exports = routes;