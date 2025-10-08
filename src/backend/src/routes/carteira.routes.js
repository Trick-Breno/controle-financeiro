import { Router } from 'express';
import { clerkProtector } from '../middlewares/auth.middleware.js'; 
import { handleCreateCarteira, handleGetCarteira, handleUpdateCarteira } from '../controllers/carteira.controller.js';

const router = Router();

router.post('/', clerkProtector, handleCreateCarteira);
router.get('/', clerkProtector, handleGetCarteira);
router.put('/:id', clerkProtector, handleUpdateCarteira);

export default router;
