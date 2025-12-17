import { Router } from 'express';
import { clerkProtector } from '../middlewares/auth.middleware.js'; 
import { createCarteira,getCarteiraById, getAllCarteiras, updateCarteira, deleteCarteira} from '../controllers/carteira.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createCarteiraSchema, getCarteiraByIdSchema, updateCarteiraSchema} from '../schemas/carteira.schema.js';

const router = Router();

router.use(clerkProtector)
router.post('/', validate(createCarteiraSchema), createCarteira);
router.get('/', getAllCarteiras);
router.get('/:id', validate(getCarteiraByIdSchema), getCarteiraById);
router.patch('/:id', validate(updateCarteiraSchema), updateCarteira);
router.delete('/:id',validate(getCarteiraByIdSchema), deleteCarteira);

export default router;
