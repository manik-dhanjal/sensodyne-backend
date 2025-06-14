import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Initate validation pipeline for DTOs
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 10000);
}
bootstrap();
