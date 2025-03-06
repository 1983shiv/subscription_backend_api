import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorizeUser  from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authorizeUser, getUsers); 
userRouter.get('/:id', authorizeUser, getUser);
userRouter.post('/', (req, res) => res.send({ title: 'Create a new user'}));
userRouter.put('/:id', (req, res) => res.send({ title: 'update single user'}));
userRouter.delete('/:id', (req, res) => res.send({ title: 'delete single user'}));

export default userRouter;