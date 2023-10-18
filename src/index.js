const express = require('express');
const app = express();

const cors = require('cors');

const loginRoutes = require('./routes/login');
const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const transacoesRoutes = require('./routes/transacoes');

const errorsMiddlewares = require('./middlewares/errors');

app.use(cors());

app.use(express.json());

app.use(loginRoutes, usuariosRoutes, categoriasRoutes, transacoesRoutes);

app.use(errorsMiddlewares.errorHandler);

app.listen(process.env.PORT);