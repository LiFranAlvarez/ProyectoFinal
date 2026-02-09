import { Router } from "express";
import UserController from "../controllers/usuario.controller";
import validate from "../middlewares/validate";
import { createUsuarioSchema } from "../validators/usuario.validator";
import { verifyApiKey } from "../middlewares/authToken";

const userRouter = Router();

userRouter.get('/usuarios',verifyApiKey, UserController.getUsers); 
userRouter.get('/usuario/:id',verifyApiKey, UserController.getUserById); 
userRouter.post('/usuario',verifyApiKey, validate(createUsuarioSchema, 'body'), UserController.createUser); 
userRouter.put('/usuario/:id',verifyApiKey, UserController.UpdateUserById) 
userRouter.delete('/usuario/:id',verifyApiKey, UserController.deleteUserbyId) 
export default userRouter;