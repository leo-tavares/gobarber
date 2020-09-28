import authConfig from '@config/auth';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // user.password - encrypted password
    // password - non encrypted password
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    // Always when a method returns a Promise, it must have
    // "await"

    const { secret, expiriesIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiriesIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
