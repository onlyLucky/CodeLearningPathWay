import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { TodosModule } from './modules/todos/todos.module';
import { AuthModule } from './modules/auth/auth.module';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    UsersModule,
    TodosModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.test', '.env.production'],
      load: [redisConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
