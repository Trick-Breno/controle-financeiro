import pool from '../config/db.js';

export const createAtomica = async (movimentacao) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { userId, id_carteira, descricao, valor, tipo, data_referencia, status } = movimentacao;

        const queryMov = `
            INSERT INTO movimentacoes
            (user_id, id_carteira, descricao, valor, tipo, data_referencia, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const {rows} = await client.query(queryMov, [
            userId,
            id_carteira,
            descricao,
            valor,
            tipo,
            data_referencia,
            status
        ]);

        if (status === 'concluido' && id_carteira) {
            let querySaldo = '';

            if (tipo === 'receita') {
                querySaldo = `UPDATE carteiras SET saldo_atual = saldo_atual + $1 WHERE id = $2`;    
            } else if (tipo === 'despesa') {
                querySaldo =    `UPDATE carteiras SET saldo_atual = saldo_atual - $1 WHERE id = $2`
            }

            await client.query(querySaldo, [valor, id_carteira]);
        }

        await client.query('COMMIT');
        return rows[0];

    } catch (error) {
        await client.query('ROLLBACK');

        throw error;
    } finally {
        client.release();
    }
};

export const findAll = async (userId) => {
    const query = `SELECT * FROM movimentacoes WHERE user_id = $1 ORDER BY data_criacao DESC`;

    const {rows} = await pool.query(query, [userId]);
    return rows;
};

export const findById = async (id, userId) => {
    const query = `SELECT * FROM movimentacoes WHERE id = $1 AND user_id = $2`;

    const {rows} = await pool.query(query, [id, userId]);
    return rows[0] || null;
};

export const update = async (id, userId, movimentacaoData ) => {
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const fields = Object.keys(movimentacaoData);
        const values = Object.values(movimentacaoData);

        if (fields.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const setClause = fields.map((field, index) => 
            `${field} = $${index + 1}`).join(', ');

        const queryParams = [...values, id, userId];
        const idParamIndex = values.length + 1;
        const userIdParamIndex = values.length + 2;

        const query = `
        UPDATE movimentacoes SET ${setClause} WHERE id = $${idParamIndex} AND user_id = $${userIdParamIndex}
        RETURNING*;
        `;

        const {rows} = await client.query(query, queryParams);
        const updatedMovimentacao = rows[0];

        if (!updatedMovimentacao) {
            await client.query('ROLLBACK');
            return null;
        }

        const idCarteira = updatedMovimentacao.id_carteira;

        const querySaldo = `
            UPDATE carteiras 
            SET saldo_atual = saldo_inicial + (
                SELECT COALESCE(SUM(
                    CASE
                        WHEN tipo = 'receita' THEN valor
                        WHEN tipo = 'despesa' THEN - valor
                        ELSE 0
                    END
                ), 0)
                FROM movimentacoes
                WHERE id_carteira = $1
                AND status = 'concluido'
            )
            WHERE id = $1;
        `;

        await client.query(querySaldo, [idCarteira]);

        await client.query('COMMIT');
        return updatedMovimentacao;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};