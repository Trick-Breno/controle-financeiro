import { Router } from 'express';
import { clerkProtector } from '../middlewares/auth.middleware.js'; 
import { createCarteira,getCarteiraById, getAllCarteiras, updateCarteira, deleteCarteira} from '../controllers/carteira.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createCarteiraSchema } from '../schemas/carteira.schema.js';

const router = Router();

router.use(clerkProtector)
router.post('/', validate(createCarteiraSchema), createCarteira);
router.get('/', getAllCarteiras);
router.get('/:id', getCarteiraById);
router.patch('/:id', updateCarteira);
router.delete('/:id', deleteCarteira);

export default router;
