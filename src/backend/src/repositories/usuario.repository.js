// src/repositories/usuario.repository.js
import pool from '../config/db.js';

export const createFromWebhook = async (userData) => {
    const { id, nome, email } = userData;

    const placeholderPassword = 'managed_by_clerk';

    const query = `
    INSERT INTO usuarios (id, nome, email, senha_hash)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
    `;

    try {
        const { rows } = await pool.query(query, [id, nome, email, placeholderPassword]);
        return rows[0] || null;
        
    } catch (error) {
        console.error('Erro no repositório ao inserir usuário via webhook:', error);
        throw error;
    }
};