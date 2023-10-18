const HttpError = require("../utils/http-error");
const pool = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwtSecret');

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) throw new HttpError('Dados obrigatórios não fornecidos', 400);

        const { rows, rowCount } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (rowCount === 0 || !await bcrypt.compare(senha, rows[0].senha)) throw new HttpError('E-mail ou senha inválidos', 401);

        const { senha: _, ...usuario } = rows[0];

        const token = await jwt.sign({ id: usuario.id }, jwtSecret, { 'expiresIn': '10h' });

        return res.json({ usuario, token });
    } catch (e) {
        next(e);
    }
};

module.exports = { login };