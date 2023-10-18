const HttpError = require('../utils/http-error');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret');

const verificarToken = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) throw new HttpError('Você não tem permissão para acessar este recurso. Autenticação necessária', 401);

        const token = authorization.split(' ')[1];

        const { id } = jwt.verify(token, jwtSecret);

        req.id = id;

        next();
    } catch (e) {
        next(e);
    }
};

module.exports = { verificarToken };