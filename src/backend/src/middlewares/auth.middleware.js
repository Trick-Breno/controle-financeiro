import { clerkMiddleware, getAuth } from '@clerk/express';
import dotenv from 'dotenv';

dotenv.config();

export const clerkInitializer = clerkMiddleware();

export const clerkProtector = async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth?.userId) {
      return res.status(401).json({
        error: 'Acesso não autorizado. Token ausente ou inválido.',
      });
    }

    req.auth = auth;
    next();
  } catch (error) {
    console.error('Erro ao verificar token Clerk:', error);
    return res.status(401).json({ error: 'Falha na autenticação.' });
  }
};
