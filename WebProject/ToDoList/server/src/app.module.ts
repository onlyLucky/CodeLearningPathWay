import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    UsersModule,
    TodosModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.test', '.env.production'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
