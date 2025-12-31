import { Router } from "express";
import { clerkProtector } from "../middlewares/auth.middleware.js";
import { createMovimentacao, getAllMovimentacoes, getMovimentacaoById } from "../controllers/movimentacao.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createMovimentacaoSchema, getMovimentacaoByIdSchema } from "../schemas/movimentacao.schema.js";

const router = Router();

router.use(clerkProtector);
router.post('/',validate(createMovimentacaoSchema), createMovimentacao);
router.get('/', getAllMovimentacoes);
router.get('/:id', validate(getMovimentacaoByIdSchema), getMovimentacaoById);

export default router;
