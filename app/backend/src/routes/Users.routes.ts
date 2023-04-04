import { Router, Request, Response } from 'express';
import UserService from '../services/Users.service';
import loginValidMiddleware from '../middlewares/loginValidMiddleware';
import tokenValidation from '../middlewares/validateTokenJwt';
import UserController from '../controllers/Users.controller';

const routerUsers = Router();

const userService = new UserService();
const userController = new UserController(userService);

routerUsers.post(
  '/',
  loginValidMiddleware,
  (req: Request, res: Response) => userController.loginUserController(req, res),
);

routerUsers.get(
  '/role',
  tokenValidation,
  (req: Request, res: Response) => UserController.roleAuthorization(req, res),
);

export default routerUsers;
