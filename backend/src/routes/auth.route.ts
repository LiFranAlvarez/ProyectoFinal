import { Router } from "express";
import signInController from "../controllers/auth.controller";
import { verifyApiKey } from "../middlewares/authToken";

const authRouter = Router();

authRouter.post('/signin',verifyApiKey, signInController);

export default authRouter;
