import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { Todo } from '../../entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto, QueryTodoDto } from './dto/todos.dto';
import {
  getPaginationParams,
  createPaginatedResponse,
  calculateOffset,
} from '../../common/utils/pagination.util';
import { PaginatedResponse } from '../../common/interfaces';

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

  async findAll(
    userId: number,
    queryTodoDto: QueryTodoDto,
  ): Promise<PaginatedResponse<Todo>> {
    const { pageNum, pageSize, sortBy, sortOrder } =
      getPaginationParams(queryTodoDto);
    const offset = calculateOffset(pageNum!, pageSize!);

    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    queryBuilder.where('todo.userId = :userId', { userId });

    if (queryTodoDto.status) {
      queryBuilder.andWhere('todo.status = :status', {
        status: queryTodoDto.status,
      });
    }

    if (queryTodoDto.priority) {
      queryBuilder.andWhere('todo.priority = :priority', {
        priority: queryTodoDto.priority,
      });
    }

    if (queryTodoDto.reminderType) {
      queryBuilder.andWhere('todo.reminderType = :reminderType', {
        reminderType: queryTodoDto.reminderType,
      });
    }

    if (queryTodoDto.title) {
      queryBuilder.andWhere('todo.title LIKE :title', {
        title: `%${queryTodoDto.title}%`,
      });
    }

    if (queryTodoDto.description) {
      queryBuilder.andWhere('todo.description LIKE :description', {
        description: `%${queryTodoDto.description}%`,
      });
    }

    if (queryTodoDto.deadlineTime) {
      queryBuilder.andWhere('DATE(todo.deadlineTime) = :deadlineTime', {
        deadlineTime: queryTodoDto.deadlineTime,
      });
    }

    if (queryTodoDto.reminderTime) {
      queryBuilder.andWhere('DATE(todo.reminderTime) = :reminderTime', {
        reminderTime: queryTodoDto.reminderTime,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy(`todo.${sortBy}`, sortOrder)
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    return createPaginatedResponse(data, total, pageNum!, pageSize!);
  }

  async findOne(id: number, userId?: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    if (userId && todo.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this todo',
      );
    }

    return todo;
  }

  async update(userId: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(updateTodoDto.id, userId);

    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(ids: string, userId: number): Promise<boolean> {
    const idArray = ids.split(',').map((id) => +id.trim());

    const queryBuilder = this.todoRepository.createQueryBuilder('todo');
    queryBuilder.where('todo.userId = :userId', { userId });
    queryBuilder.andWhere('todo.id IN (:...ids)', { ids: idArray });

    const todos = await queryBuilder.getMany();

    if (todos.length === 0) {
      throw new NotFoundException('No todos found with the provided IDs');
    }

    if (todos.length !== idArray.length) {
      throw new ForbiddenException(
        'Some todos do not belong to you or do not exist',
      );
    }

    await this.todoRepository.remove(todos);
    return true;
  }

  async markAsCompleted(id: number, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    todo.status = '2';
    todo.completedTime = new Date();
    return this.todoRepository.save(todo);
  }

  async getStatistics(userId?: number): Promise<{
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  }> {
    if (!userId) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
      };
    }

    const todosResponse = await this.findAll(userId, {});

    return {
      total: todosResponse.total,
      completed: todosResponse.data.filter((t) => t.status === '2').length,
      pending: todosResponse.data.filter((t) => t.status === '0').length,
      inProgress: todosResponse.data.filter((t) => t.status === '1').length,
    };
  }
}
