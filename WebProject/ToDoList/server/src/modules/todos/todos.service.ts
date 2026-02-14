import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { Todo } from '../../entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly redisService: RedisService,
  ) {}

  private async invalidateUserTodosCache(userId: number): Promise<void> {
    const keys = [
      this.redisService.generateUserKey(userId, 'todos'),
      this.redisService.generateUserKey(userId, 'todos', 'status=pending'),
      this.redisService.generateUserKey(userId, 'todos', 'status=in_progress'),
      this.redisService.generateUserKey(userId, 'todos', 'status=completed'),
    ];

    await Promise.all(keys.map((key) => this.redisService.del(key)));
  }

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });

    const savedTodo = await this.todoRepository.save(todo);

    await this.invalidateUserTodosCache(userId);

    return savedTodo;
  }

  async findAll(userId: number, status?: string): Promise<Todo[]> {
    const cacheKey = this.redisService.generateUserKey(
      userId,
      'todos',
      status ? `status=${status}` : '',
    );
    const cachedTodos = await this.redisService.get<Todo[]>(cacheKey);

    if (cachedTodos) {
      return cachedTodos;
    }

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const todos = await this.todoRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(cacheKey, todos);
    return todos;
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
    const updatedTodo = await this.todoRepository.save(todo);

    await this.invalidateUserTodosCache(userId);

    return updatedTodo;
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);

    await this.invalidateUserTodosCache(userId);
  }

  async markAsCompleted(id: number, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.status = 'completed';
    todo.completedAt = new Date();
    const updatedTodo = await this.todoRepository.save(todo);

    await this.invalidateUserTodosCache(userId);

    return updatedTodo;
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
