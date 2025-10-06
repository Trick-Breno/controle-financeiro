import pool from "../config/db.js";

export const insertCarteira = async (carteiraData) => {
    const { userId, nome, saldo_inicial, saldo_atual } = carteiraData;
    
    const query = `
    INSERT INTO carteiras (user_id, nome, saldo_inicial, saldo_atual, ativo )
    VALUES ($1, $2, $3, $4, TRUE)
    RETURNING *;
    `;

    try {
        const { rows } = await pool.query(query, [userId, nome, saldo_inicial, saldo_atual]);
        return rows[0];
    } catch (error) {
        console.error('Erro no repository ao inserir carteira:', error);
        throw error;
    }
};

export const findByUserId = async (userId) => {
    const query = 'SELECT * FROM carteiras WHERE user_id = $1 ORDER BY nome ASC';
    try {
        const {rows} = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Erro no repositório ao buscar carteiras por user_id:', error);
        throw error;
    }
};