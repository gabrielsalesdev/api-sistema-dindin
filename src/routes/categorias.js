const express = require('express');
const routes = express.Router();

const categoriasControllers = require('../controllers/categorias');

const tokensMiddlewares = require('../middlewares/tokens');

routes.use(tokensMiddlewares.verificarToken);

routes.get('/categoria', categoriasControllers.listarCategorias);

module.exports = routes;