import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import ILogin from '../interfaces/ILogin';
import IResponse from '../interfaces/IResponse';
import User from '../database/models/User';
import { createToken } from '../utils/jwtToken';
import inputLogin from '../validations/inputLogin';

class UserService {
  private model: ModelStatic<User> = User;

  public async loginUserService(user: ILogin): Promise<IResponse> {
    const resultUser = await this.model.findOne({ where: { email: user.email } });
    const error = inputLogin(user);

    if (error || resultUser === null) {
      return UserService.errorResponse(401, 'Invalid email or password');
    }

    const passwordCrypt = bcrypt.compareSync(user.password, resultUser?.password as string);

    if (!resultUser || !passwordCrypt) {
      return UserService.errorResponse(401, 'Invalid email or password');
    }

    const { id, email, role, username } = resultUser;
    const token = await createToken({ id, email, role, username });

    return UserService.successResponse(200, { token });
  }

  private static successResponse(status: number, message: unknown): IResponse {
    return { status, message };
  }

  private static errorResponse(status: number, message: unknown): IResponse {
    return UserService.successResponse(status, { message });
  }
}

export default UserService;
// const cryptUserPassword = bcrypt.hashSync(user.password, 10);
