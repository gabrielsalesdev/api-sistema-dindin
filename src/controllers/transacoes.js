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

module.exports = { listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, excluirTransacao, obterExtratoTransacao };