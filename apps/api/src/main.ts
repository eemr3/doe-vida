import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { stoplightSetup } from './config/stoplight.config';
import { DomainExceptionFilter } from './shared/exceptions/domain-exception.filter';
import { scalarSetup } from './config/scalar.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');
  const env = configService.get<string>('app.env');
  const name = configService.get<string>('app.name');

  const allowedOrigins = (configService.get<string>('app.allowedOrigins') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (env !== 'production') {
    scalarSetup(app, configService);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
  app.getHttpAdapter().get('/openapi.json', (req, res) => {
    res.json(document);
  });

  await app.listen(port ?? 3001, () => {
    console.log(`🚀 ${name} is running on port ${port}`);
  });
}
bootstrap();
