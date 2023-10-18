const pool = require('../database/connection');

const listarCategorias = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categorias');

        return res.json(rows);
    } catch (e) {
        next(e);
    }
};

module.exports = { listarCategorias };