import { z } from 'zod';

export const createCarteiraSchema = z.object({
  body: z.object({
    nome: z.string()
    .trim()
    .min(1, { message: 'O campo "nome" não pode estar vazio.' })
    .max(50, { message: 'Max 100 caracteres permitido'}), 
   
    saldo_inicial: z.number()
    .nonnegative({ message: 'O "saldo_inicial" deve ser um número positivo (maior ou igual a zero).' }) 

  })

});

export const getCarteiraByIdSchema = z.object({
  params: z.object({
    id: z.string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 
    { message: 'ID da carteira inválido' }),
    
  })
});

export const updateCarteiraSchema = z.object({
  params: z.object({
    id: z.string()
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 
    { message: 'ID da carteira inválido' }),

  }),
  body: z.object({
    nome: z.string()
    .trim()
    .min(1,{message: 'O campo "nome" não pode estar vazio.'})
    .max(50, {message: 'Max 100 caracteres.'})
    .optional(),

    saldo_inicial: z.number()
    .nonnegative({ message: 'O "saldo_inicial" deve ser um número positivo (maior ou igual a zero).' })
    .optional()
  })
  .refine(data => Object.keys(data).length > 0, {message: "Pelo menos um campo deve ser enviado para atualização."})
});