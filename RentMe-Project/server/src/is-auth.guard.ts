import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { PayloadType, serializeUser } from './auth/auth.utility';
import { User } from './users/entities/user.entity';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user: User;
    };

    const authorization = request.headers.authorization || '';

    if (!authorization.trim().length) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET || 'qwertyuiop',
    ) as PayloadType;

    const user = await User.findOne(decoded.id, {
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const roles = this.reflector.get<string[] | undefined>(
      'auth',
      context.getHandler(),
    );

    if (!roles.length) {
      return true;
    }

    if (!roles.includes(user.role.name)) {
      return false;
    }

    request.user = serializeUser(user);
    return true;
  }
}
