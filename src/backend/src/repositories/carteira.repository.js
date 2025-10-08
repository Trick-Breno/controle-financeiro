import pool from "../config/db.js";

export const createCarteira = async (carteiraData) => {
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

export const findUserCarteiras  = async (userId) => {
    const query = `SELECT * FROM carteiras WHERE user_id = $1 ORDER BY nome ASC`;
    
    try {
        const {rows} = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Erro no repositório ao buscar carteiras por user_id:', error);
        throw error;
    }
};

export const updateCarteiraById  = async (id, userId, carteiraData) => {
    const {nome} = carteiraData;

    const query = `
    UPDATE carteiras 
    SET nome = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *;
    `;

    try {
        const {rows} = await pool.query(query, [nome, id, userId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Erro no repositório ao atualizar carteira:', error);
        throw error;
    }
};