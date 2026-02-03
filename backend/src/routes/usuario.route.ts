import { Router } from 'express';

import UserController from '../controllers/usuario.controller';
import validate from '../middlewares/validate';
import { createUsuarioSchema } from '../validators/usuario.validator';

const userRouter = Router();

userRouter.get('/usuarios', UserController.getUsers); 
userRouter.get('/usuario/:id', UserController.getUserById); 
userRouter.post('/usuario', validate(createUsuarioSchema, 'body'), UserController.createUser); 
userRouter.put('/usuario/:id', UserController.UpdateUserById); 
userRouter.delete('/usuario/:id', UserController.deleteUserbyId); 
export default userRouter;
