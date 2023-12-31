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

const detalharUsuario = async (req, res, next) => {
    try {
        const id = req.id;

        const { rows } = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = $1;', [id]);

        return res.json(rows[0]);
    } catch (e) {
        next(e);
    }
};

const atualizarUsuario = async (req, res, next) => {
    try {
        const id = req.id;
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) throw new HttpError('Dados obrigatórios não fornecidos', 400);

        const { rowCount } = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND id != $2;', [email, id]);
        if (rowCount > 0) throw new HttpError('O e-mail fornecido já está sendo utilizado por outro usuário', 409);

        const senhaCrypt = await bcrypt.hash(senha, 10);

        await pool.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4', [nome, email, senhaCrypt, id]);

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
};

module.exports = { cadastrarUsuario, detalharUsuario, atualizarUsuario };