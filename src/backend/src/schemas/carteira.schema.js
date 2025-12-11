import { z } from 'zod';

export const createCarteiraSchema = z.object({
  body: z.object({
    
    nome: z.string({
      required_error: 'O campo "nome" é obrigatório.',
      invalid_type_error: 'O campo "nome" deve ser um texto.'
    })
    .trim()
    .min(1, { message: 'O campo "nome" não pode estar vazio.' })
    .max(100, { message: 'Max 100 caracteres permitido no campo "nome".' }), 
   
    saldo_inicial: z.number({
      required_error: 'O campo "saldo_inicial" é obrigatório.',
      invalid_type_error: 'O campo "saldo_inicial" deve ser um número.'
    })
    .nonnegative({ message: 'O "saldo_inicial" deve ser um número positivo (maior ou igual a zero).' }) 

  })

});