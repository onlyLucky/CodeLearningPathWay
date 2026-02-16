import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';
import { validationPipe } from './config/validation.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import {
  LoggingInterceptor,
  TransformInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';
import { join } from 'path';

/**
 * 应用启动函数
 * 负责初始化 NestJS 应用、注册全局中间件、过滤器、拦截器、CORS、静态资源及 Swagger 文档
 */
async function bootstrap() {
  // 使用 NestExpressApplication 平台创建应用实例，并集成 winston 日志
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonConfig,
  });

  // 注册全局验证管道，统一处理入参校验
  app.useGlobalPipes(validationPipe);
  // 注册全局异常过滤器，统一处理 HTTP 异常并记录日志
  app.useGlobalFilters(new HttpExceptionFilter(winstonConfig));
  // 注册全局拦截器：日志、返回值转换、接口超时处理
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );
  // 启用跨域支持
  app.enableCors();
  // 设置全局路由前缀，所有接口统一加上 /apis
  app.setGlobalPrefix('apis');
  // 配置静态资源目录，访问前缀为 /uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 构建 Swagger 文档基本信息
  const config = new DocumentBuilder()
    .setTitle('ToDoList API')
    .setDescription('The ToDoList API documentation')
    .setVersion('1.0')
    .addTag('todos')
    .addTag('users')
    .build();

  // 创建 Swagger 文档并挂载到指定路径
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/docs', app, document);

  // 启动应用，监听环境变量 PORT 或默认 3000 端口
  await app.listen(process.env.PORT ?? 3000);
}

// 立即执行启动函数
void bootstrap();
