import pool from "../config/db.js";
import { ConflictError } from "../utils/AppError.js";

export const insert = async (carteira) => {
    const { userId, nome, saldo_inicial, saldo_atual } = carteira;
    
    const query = `
    INSERT INTO carteiras (user_id, nome, saldo_inicial, saldo_atual, ativo )
    VALUES ($1, $2, $3, $4, TRUE)
    RETURNING *;
    `;

    try {
        const { rows } = await pool.query(query, [userId, nome, saldo_inicial, saldo_atual]);
        return rows[0];
    } catch (error) {
        if (error?.code === '23505') {
            throw new ConflictError('Já existe uma carteira com este nome.',{
                field: 'nome', code: 'CARTEIRA_DUPLICADA'
            });
        }
        throw error;
    }
};

export const findAll = async (userId) => {
    const query = `SELECT * FROM carteiras WHERE user_id = $1 ORDER BY nome ASC`;
    
    try {
        const {rows} = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Erro no repositório ao buscar carteiras do usuario:', error);
        throw error;
    }
};

export const findById = async(id, userId) => {
    const query = `SELECT * FROM carteiras WHERE id = $1 AND user_id = $2`;

    try {
        const {rows} = await pool.query(query, [id, userId]);
        return rows[0] || null;
    } catch (error) {
        console.error('Erro no repositório ao buscar carteira por ID:', error);
        throw error;
    }
};

export const update = async (id, userId, carteiraData) => {
    const fields = Object.keys(carteiraData);
    const values = Object.values(carteiraData);

    if (fields.length === 0) {
        throw new Error('Nenhum campo fornecido para atualização')
    }

    let setClause = fields.map((field, index) => 
        `${field} = $${index + 1}`).join(',');

    const queryParams = [...values, id, userId];

    const query = ` 
    UPDATE carteiras
    SET ${setClause}
    WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2}
    RETURNING*;
    `;

    try{
        const {rows} = await pool.query(query, queryParams);
        return rows[0] || null;
    } catch (error) {
        console.error('Erro no repositório ao atualizar parcialmente carteira:', error);
        throw error;
    }
};

export const remove = async(id, userId) => {
    const query = `DELETE FROM carteiras WHERE id = $1 AND user_id = $2`;

    try {
        const result = await pool.query(query, [id, userId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Erro no repositório ao Deletar carteira:', error);
        throw error;
    }
}