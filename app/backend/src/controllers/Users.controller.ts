import { Request, Response } from 'express';
import UserService from '../services/Users.service';

class UserController {
  constructor(private _service: UserService) { }

  public async loginUserController(req: Request, res: Response) {
    const { status, message } = await this._service.loginUserService(req.body);
    res.status(status).json(message);
  }

  static async roleAuthorization(req: Request, res: Response) {
    const { locals: { user: { data: { role } } } } = res;

    res.status(200).json({ role });
  }
}

export default UserController;
