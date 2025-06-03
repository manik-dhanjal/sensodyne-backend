import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from '../gaurds/auth.gaurd'; // You need to implement this guard
import { CreateUserDto, LoginDto } from './dto/user.dto';
import { UserDocument } from './user.schema';
import * as jwt from 'jsonwebtoken';
import { AUTH_CONFIG_NAME, AuthConfig } from 'src/config/auth.config';
import { ConfigService } from '@nestjs/config';
import { omit as _omit } from 'lodash';
import { Role } from './enum/role.enum';
import { UseRoles } from 'src/decorators/use-role.decorator';

@Controller('user')
export class UserController {
  private readonly authConfig: AuthConfig;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    // Load auth configuration
    const authConfig = this.configService.get<AuthConfig>(AUTH_CONFIG_NAME);
    if (!authConfig) {
      throw new Error('Auth configuration not found');
    }
    this.authConfig = authConfig;
  }

  // Register endpoint
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(
      createUserDto.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const user = await this.userService.register(createUserDto);
    return _omit(user.toJSON(), ['password', '__v']);
  }

  // Login endpoint
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
      userId: user._id,
      tokenType: 'ACCESS_TOKEN',
    };
    const token = jwt.sign(payload, this.authConfig.jwtSecret, {
      expiresIn: '12h',
    });
    return {
      ..._omit(user.toJSON(), ['password', '__v']),
      token,
    };
  }

  // Get current user endpoint (protected)
  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    req.user.password = undefined;
    req.user.__v = undefined;
    return req.user;
  }

  // create endpoint to get all users
  @UseGuards(AuthGuard)
  @UseRoles(Role.ADMIN)
  @Get('all')
  async getAllUsers(@Req() req) {
    console.log(req.user);
    return this.userService.findAll();
  }
}
