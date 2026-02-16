import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * 数据库模块
 * 负责初始化 TypeORM 连接，所有数据库相关配置均通过 ConfigService 读取环境变量注入
 */
@Module({
  imports: [
    // 使用异步工厂方式创建 TypeORM 连接，便于运行时读取配置
    TypeOrmModule.forRootAsync({
      // 依赖 ConfigModule，确保 ConfigService 可用
      imports: [ConfigModule],
      /**
       * 工厂函数：根据 ConfigService 提供的配置项创建数据库连接参数
       * @param configService 配置服务，用于读取环境变量
       * @returns TypeORM 连接配置对象
       */
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型：MySQL
        host: configService.get('DB_HOST', 'localhost'), // 主机地址，默认 localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号，默认 3306
        username: configService.get('DB_USERNAME', 'root'), // 用户名，默认 root
        password: configService.get('DB_PASSWORD', ''), // 密码，默认空字符串
        database: configService.get('DB_DATABASE', 'todolist'), // 数据库名，默认 todolist
        // 自动加载实体文件，支持 ts 与 js 后缀
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        // 是否自动同步数据库结构（生产环境务必设为 false）
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        // 是否开启 SQL 日志
        logging: configService.get<boolean>('DB_LOGGING', false),
        // 连接池大小，默认 10
        poolSize: configService.get<number>('DB_POOL_SIZE', 10),
        // 慢查询阈值（毫秒），超过该时间将记录日志，默认 1000ms
        maxQueryExecutionTime: configService.get<number>(
          'DB_MAX_QUERY_TIME',
          1000,
        ),
        // 迁移文件路径，支持 ts 与 js 后缀
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        // 应用启动时是否自动执行迁移，默认 false
        migrationsRun: configService.get<boolean>('DB_MIGRATIONS_RUN', false),
      }),
      // 注入 ConfigService 作为依赖
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
