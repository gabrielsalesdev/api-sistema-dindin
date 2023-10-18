const HttpError = require('../utils/http-error');
const bcrypt = require('bcrypt');
const pool = require('../database/connection');

const cadastrarUsuario = async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) throw new HttpError('Dados obrigatórios não fornecidos', 400);

        const { rowCount } = await pool.query('SELECT * FROM usuarios WHERE email = $1;', [email]);
        if (rowCount > 0) throw new HttpError('O e-mail fornecido já está sendo utilizado por outro usuário', 409);

        const senhaCrypt = await bcrypt.hash(senha, 10);

        const { rows } = await pool.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email', [nome, email, senhaCrypt]);

        res.status(201).json(rows[0]);
    } catch (e) {
        next(e);
    }
};

module.exports = { cadastrarUsuario, detalharUsuario, atualizarUsuario };