import { Router } from "express";
import signInController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/signin', signInController);

export default authRouter;
