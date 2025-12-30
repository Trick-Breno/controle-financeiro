import {z} from 'zod';

export const createMovimentacaoSchema = z.object({
    body: z.object({
        carteiraId: z.string(),

        descricao: z.string().trim()
        .min(1,{message:'A descrição não pode estar vazia'})
        .max(200,{message:'A descrição deve ter no máximo 255 caracteres'}),

        valor: z.number().positive(),

        tipo: z.enum(['receita', 'despesa'], {erroMap: () => ({message: 'O tipo deve ser "receita" ou "despesa".'})}),

        status: z.enum(['pendente', 'parcial', 'concluido'], {errorMap: () => ({message: 'O status deve ser "pendente", "parcial" ou "concluido"'})})
        .optional().default('pendente'),

        dataReferencia: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD (ex: 2024-12-25).'}),
    })
});