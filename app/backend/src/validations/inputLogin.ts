import ILogin from '../interfaces/ILogin';
import loginSchema from './loginSchema';

const inputLogin = (user: ILogin) => {
  const { error } = loginSchema.validate(user);
  if (error) {
    return error;
  }
  return null;
};

export default inputLogin;
