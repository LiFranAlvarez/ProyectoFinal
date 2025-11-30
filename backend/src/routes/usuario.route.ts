import { Router } from "express";
import UserController from "../controllers/usuario.controller";
import validate from "../middlewares/validate";
import { createUsuarioSchema } from "../validators/usuario.validator";

const userRouter = Router();

userRouter.get('/usuarios', UserController.getUsers); // Lista todos los usuarios
userRouter.get('/usuario/:id', UserController.getUserById); // Busca usuario por id v
userRouter.post('/usuario', validate(createUsuarioSchema, 'body'), UserController.createUser); // crea un usuario v (validado)
userRouter.put('/usuario/:id', UserController.UpdateUserById) // actualiza un usuario pasado por body solo campos nombre, email
userRouter.delete('/usuario/:id', UserController.deleteUserbyId) // elimina el usuario
export default userRouter;