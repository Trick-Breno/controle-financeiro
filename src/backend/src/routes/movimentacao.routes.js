import { Router } from "express";
import { clerkProtector } from "../middlewares/auth.middleware.js";
import { createMovimentacao } from "../controllers/movimentacao.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createMovimentacaoSchema } from "../schemas/movimentacao.schema.js";

const router = Router();

router.use(clerkProtector);
router.post('/',validate(createMovimentacaoSchema), createMovimentacao);

export default router;
