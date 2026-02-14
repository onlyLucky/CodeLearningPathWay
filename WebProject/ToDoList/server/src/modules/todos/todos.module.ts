import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { Todo } from '../../entities/todo.entity';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), AuthModule, CommonModule],
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}
