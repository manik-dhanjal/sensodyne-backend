import { AuthConfig, AUTH_CONFIG_NAME } from '../config/auth.config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly authConfig: AuthConfig;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {
    const authConfig = this.configService.get<AuthConfig>(AUTH_CONFIG_NAME);
    if (!authConfig) {
      throw new Error('Auth configuration not found');
    }
    this.authConfig = authConfig;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('jwt access token is missing.');
    }
    try {
      const tokenPayload = jwt.verify(
        token,
        this.authConfig.jwtSecret,
      ) as jwt.JwtPayload;

      if (!tokenPayload?.userId) {
        throw new Error('Bearer token is not a valid access token');
      }
      const user = await this.userService.findById(tokenPayload.userId);
      if (!user) {
        new Error('User doesnt exist for request token');
      }
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
