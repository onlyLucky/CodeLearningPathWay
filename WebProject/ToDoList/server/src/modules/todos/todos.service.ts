import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../../entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });

    return this.todoRepository.save(todo);
  }

  async findAll(userId: number, status?: string): Promise<Todo[]> {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    return this.todoRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this todo',
      );
    }

    return todo;
  }

  async update(
    id: number,
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);
  }

  async markAsCompleted(id: number, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.status = 'completed';
    todo.completedAt = new Date();
    return this.todoRepository.save(todo);
  }

  async getStatistics(userId: number): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  }> {
    const todos = await this.findAll(userId);

    return {
      total: todos.length,
      completed: todos.filter((t) => t.status === 'completed').length,
      pending: todos.filter((t) => t.status === 'pending').length,
      inProgress: todos.filter((t) => t.status === 'in_progress').length,
    };
  }
}
