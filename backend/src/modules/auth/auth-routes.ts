//mapira odgovarajuci HTTP metod na odgovarajuci kontroler

import { Router } from "express";
import { loginController, registerController } from "./auth-controller";

const router = Router();

//kad stigne zahtjev na npr. /api/auth/register, express poziva register kontroler

router.post('/register', registerController);
router.post('/login', loginController);

export default router;