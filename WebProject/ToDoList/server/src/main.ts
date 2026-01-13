import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';
import { validationPipe } from './config/validation.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import {
  LoggingInterceptor,
  TransformInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });

  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new HttpExceptionFilter(winstonConfig));
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ToDoList API')
    .setDescription('The ToDoList API documentation')
    .setVersion('1.0')
    .addTag('todos')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
