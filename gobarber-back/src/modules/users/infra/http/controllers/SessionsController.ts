// Controllers must have at most 5 methods: index, show, create, update and delete
// Controllers are responsible to receive requests, forward those request to other files and give back the response

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticatedUserService from '@modules/users/services/AuthenticatedUserService';

// If it has more de those 5 methods, you should create another new controller

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticationUser = container.resolve(AuthenticatedUserService);

    const { user, token } = await authenticationUser.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
