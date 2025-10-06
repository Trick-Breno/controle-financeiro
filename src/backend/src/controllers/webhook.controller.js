import { Webhook } from 'svix';
import { syncUser } from '../services/webhook.service.js';

export const handleClerkWebhook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return res.status(500).send('Erro: CLERK_WEBHOOK_SECRET não configurado no servidor.');
  }

  const headers = req.headers;
  // O corpo da requisição vem como um "buffer" por causa do middleware que vamos usar
  const payload = req.body.toString('utf-8');

  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send('Erro: Cabeçalhos do Svix ausentes.');
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Erro na verificação do webhook:', err.message);
    return res.status(400).send(`Erro de Webhook: ${err.message}`);
  }

  const { type, data } = evt;

  if (type === 'user.created') {
    try {
      await syncUser(data);
      return res.status(201).json({ message: 'Usuário sincronizado com sucesso' });
    } catch (error) {
      console.error('Erro no serviço de sincronização:', error);
      return res.status(500).json({ error: 'Erro interno ao processar o webhook' });
    }
  }

  res.status(200).json({ message: 'Webhook recebido, mas nenhum evento tratado.' });
};