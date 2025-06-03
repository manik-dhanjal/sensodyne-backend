import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AuthConfig {
  jwtSecret: string;
}

export const AUTH_CONFIG_NAME = 'user-config';

export const authConfig = registerAs(AUTH_CONFIG_NAME, (): AuthConfig => {
  const jwtSecret = Joi.string()
    .min(20)
    .required()
    .validate(process.env.JWT_SECRET).value;
  return {
    jwtSecret,
  };
});
