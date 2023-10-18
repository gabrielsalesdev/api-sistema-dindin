const HttpError = require('../utils/http-error');
const bcrypt = require('bcrypt');
const pool = require('../database/connection');

const listarTransacoes = async (req, res, next) => {
    try {
        const id = req.id;
        const { filtro } = req.query;

        if (filtro && !Array.isArray(filtro)) throw new HttpError('O filtro deve ser um array de categorias', 400);

        const queryFiltro = !filtro ? '' : `AND c.descricao ILIKE ANY($2)`;
        const params = !filtro ? [id] : [id, filtro];

        const { rows } = await pool.query(`
            SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
            FROM transacoes t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.usuario_id = $1 ${queryFiltro};
        `, params);

        return res.json(rows);
    } catch (e) {
        next(e);
    }
};

const detalharTransacao = async (req, res, next) => {
    try {
        const id = req.id;
        const transacaoId = req.params.id;

        const { rows, rowCount } = await pool.query(`
            SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
            FROM transacoes t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.usuario_id = $1 AND t.id = $2;
        `, [id, transacaoId]);

        if (rowCount === 0) throw new HttpError('Transação não encontrada', 404);

        return res.json(rows[0]);
    } catch (e) {
        next(e);
    }
};


const cadastrarTransacao = async (req, res, next) => {
    try {
        const id = req.id;
        const { tipo, descricao, valor, data, categoria_id } = req.body;

        if (!tipo || !descricao || !valor || !data || !categoria_id) throw new HttpError('Dados obrigatórios não fornecidos', 400);
        if (tipo !== 'entrada' && tipo !== 'saida') throw new HttpError('Tipo inválido. Deve ser \'entrada\' ou \'saida\'', 400);

        const { rowCount } = await pool.query('SELECT * FROM categorias WHERE id = $1;', [categoria_id]);
        if (rowCount === 0) throw new HttpError('Categoria não encontrada', 404);

        const { rows: rowsInsert } = await pool.query(`
            INSERT INTO transacoes (tipo, descricao, valor, data, usuario_id, categoria_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `, [tipo, descricao, valor, data, id, categoria_id]);

        const { rows } = await pool.query(`
            SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome
            FROM transacoes t
            JOIN categorias c ON t.categoria_id = c.id
            WHERE t.usuario_id = $1 AND t.id = $2;
        `, [id, rowsInsert[0].id])

        return res.status(201).json(rows[0]);
    } catch (e) {
        next(e);
    }
};

const atualizarTransacao = async (req, res, next) => {
    try {
        const id = req.id;
        const transacaoId = req.params.id;
        const { tipo, descricao, valor, data, categoria_id } = req.body;

        const { rowCount: rowCountTransacao } = await pool.query(`
        SELECT *
        FROM transacoes
        WHERE id = $1 AND usuario_id = $2;
        `, [transacaoId, id]);

        if (rowCountTransacao === 0) throw new HttpError('Transação não encontrada', 404);

        if (!tipo || !descricao || !valor || !data || !categoria_id) throw new HttpError('Dados obrigatórios não fornecidos', 400);
        if (tipo !== 'entrada' && tipo !== 'saida') throw new HttpError('Tipo inválido. Deve ser \'entrada\' ou \'saida\'', 400);

        const { rowCount: rowCountCategoria } = await pool.query('SELECT * FROM categorias WHERE id = $1;', [categoria_id]);
        if (rowCountCategoria === 0) throw new HttpError('Categoria não encontrada', 404);

        await pool.query(`
        UPDATE transacoes 
        SET tipo = $1, descricao = $2, valor = $3, data = $4, usuario_id = $5, categoria_id = $6
        WHERE id = $7;
        `, [tipo, descricao, valor, data, id, categoria_id, transacaoId]);

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
};

const excluirTransacao = async (req, res, next) => {
    try {
        const id = req.id;
        const transacaoId = req.params.id;

        const { rowCount: rowCountTransacao } = await pool.query(`
        SELECT *
        FROM transacoes
        WHERE id = $1 AND usuario_id = $2;
        `, [transacaoId, id]);

        if (rowCountTransacao === 0) throw new HttpError('Transação não encontrada', 404);

        await pool.query(`
        DELETE FROM transacoes
        WHERE id = $1;
        `, [transacaoId]);

        return res.status(204).end();
    } catch (e) {
        next(e);
    }
};

module.exports = { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, obterExtratoTransacao };