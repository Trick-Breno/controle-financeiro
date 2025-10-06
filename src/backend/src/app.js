import express from 'express';
import cors from 'cors';
import { clerkInitializer  } from './middlewares/auth.middleware.js';
import webhooksRouter from './routes/webhook.routes.js';
import carteiraRouter from './routes/carteira.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkInitializer );

app.get('/', (req, res) => {
    res.send('API do Controle financeiro está no ar!')
});

app.use('/api/webhooks', webhooksRouter);
app.use('/api/carteiras', carteiraRouter);

export default app;