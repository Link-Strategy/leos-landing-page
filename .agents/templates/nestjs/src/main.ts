import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import infraConfig from '@configs/infrastructure-config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  // --- CONFIGURATION GOVERNANCE ---
  // Mandatory DNA-governed port.
  const port = (infraConfig.topology.services as any).CHANGEME.port;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.getHttpAdapter().getInstance().set('strict routing', false);

  app.enableCors({
    origin: infraConfig.topology.gateway.allowed_origins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: '*',
  });

  await app.listen(port);
  console.log(`[Service] Listening on port ${port} (DNA Governed)`);
}

bootstrap();
