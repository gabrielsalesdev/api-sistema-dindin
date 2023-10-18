const express = require('express');
const routes = express.Router();

const usuariosControllers = require('../controllers/usuarios');

const tokensMiddlewares = require('../middlewares/tokens');

routes.post('/usuario', usuariosControllers.cadastrarUsuario);

routes.use(tokensMiddlewares.verificarToken);

routes.get('/usuario', usuariosControllers.detalharUsuario);
routes.put('/usuario', usuariosControllers.atualizarUsuario);

module.exports = routes;