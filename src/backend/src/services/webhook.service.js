// src/services/webhook.service.js
import { createFromWebhook } from '../repositories/usuario.repository.js';

export const syncUser = async (clerkUserData) => {

  const { id, first_name, email_addresses } = clerkUserData;
  const email = email_addresses[0]?.email_address;
  const nome = first_name || '';

  if (!id || !email) {
    throw new Error('ID do usuário ou e-mail não encontrado no payload do webhook.');
  }

  const userDataForDb = { id, nome, email };

  const newUser = await createFromWebhook(userDataForDb);

  if (newUser) {
    console.log('Usuário sincronizado com sucesso:', newUser);
    return { status: 'sincronizado', user: newUser };
  } else {
    console.log('Usuário já existia no banco de dados:', id);
    return { status: 'ja_existia' };
  }
};