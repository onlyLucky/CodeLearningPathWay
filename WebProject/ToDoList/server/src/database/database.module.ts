import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'todolist'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
        poolSize: configService.get<number>('DB_POOL_SIZE', 10),
        maxQueryExecutionTime: configService.get<number>(
          'DB_MAX_QUERY_TIME',
          1000,
        ),
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: configService.get<boolean>('DB_MIGRATIONS_RUN', false),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
