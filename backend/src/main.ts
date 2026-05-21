import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('NetPulse API')
    .setDescription('Plataforma de monitoramento e gerenciamento de serviços de internet')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`NetPulse Backend rodando na porta ${port}`, 'Bootstrap');
  Logger.log(`Swagger disponível em http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap();
