import pool from '../config/db.js';

export const createAtomica = async (movimentacao) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { userId, carteiraId, descricao, valor, tipo, dataReferencia, status } = movimentacao;

        const queryMov = `
            INSERT INTO movimentacoes
            (user_id, id_carteira, descricao, valor, tipo, data_referencia, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const {rows} = await client.query(queryMov, [
            userId,
            carteiraId,
            descricao,
            valor,
            tipo,
            dataReferencia,
            status
        ]);

        if (status === 'concluido' && carteiraId) {
            let querySaldo = '';

            if (tipo === 'receita') {
                querySaldo = `UPDATE carteiras SET saldo_atual = saldo_atual + $1 WHERE id = $2`;    
            } else if (tipo === 'despesa') {
                querySaldo =    `UPDATE carteiras SET saldo_atual = saldo_atual - $1 WHERE id = $2`
            }

            await client.query(querySaldo, [valor, carteiraId]);
        }

        await client.query('COMMIT');
        return rows[0];

    } catch (error) {
        await client.query('ROLLBACK');

        throw error;
    } finally {
        client.release();
    }
}