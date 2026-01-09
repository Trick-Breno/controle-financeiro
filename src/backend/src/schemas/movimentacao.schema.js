import {z} from 'zod';

export const createMovimentacaoSchema = z.object({
  body: z.object({
      id_carteira: z.string()
      .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 
      { message: 'ID da carteira inválido' }),

      descricao: z.string().trim()
      .min(1,{message:'A descrição não pode estar vazia'})
      .max(200,{message:'A descrição deve ter no máximo 200 caracteres'}),

      valor: z.number().positive(),

      tipo: z.enum(['receita', 'despesa'], {errorMap: () => ({message: 'O tipo deve ser "receita" ou "despesa".'})}),

      status: z.enum(['pendente', 'parcial', 'concluido'], {errorMap: () => ({message: 'O status deve ser "pendente", "parcial" ou "concluido"'})})
      .optional().default('pendente'),

      data_referencia: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD (ex: 2024-12-25).'}),
  })
});

export const getMovimentacaoByIdSchema = z.object({
  params: z.object({
    id: z.string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
  })
});

export const updateMovimentacaoSchema = z.object ({
  params: z.object({
    id: z.string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)
  }),

  body: z.object({
    id_carteira: z.string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 
    { message: 'ID da carteira inválido' })
    .optional(),

    descricao: z.string().trim()
    .min(1,{message:'A descrição não pode estar vazia'})
    .max(200,{message:'A descrição deve ter no máximo 200 caracteres'})
    .optional(),

    valor: z.number().optional(),

    tipo: z.enum(['receita', 'despesa'], {errorMap: () => ({message: 'O tipo deve ser "receita" ou "despesa".'})})
    .optional(),

    data_referencia: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'A data deve estar no formato AAAA-MM-DD (ex: 2024-12-25).'})
    .optional(),

    status: z.enum(['pendente', 'parcial', 'concluido'], {errorMap: () => ({message: 'O status deve ser "pendente", "parcial" ou "concluido"'})})
    .optional().default('pendente'),
  })
});