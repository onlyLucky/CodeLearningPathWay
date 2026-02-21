import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto, QueryTodoDto } from './dto/todos.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

@ApiTags('todos')
@Controller('todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new todo' })
  @HttpCode(HttpStatus.OK)
  create(
    @Request() req: RequestWithUser,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(req.user.id, createTodoDto);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all todos for the current user' })
  findAll(@Request() req: RequestWithUser, @Body() queryTodoDto: QueryTodoDto) {
    return this.todosService.findAll(req.user.id, queryTodoDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get todo statistics' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'User ID to get statistics for (optional)',
  })
  getStatistics(
    @Request() req: RequestWithUser,
    @Query('userId') userId?: string,
  ) {
    const targetUserId = userId ? +userId : req.user?.id;
    return this.todosService.getStatistics(targetUserId);
  }

  @Get('detailById')
  @ApiOperation({ summary: 'Get a specific todo by ID' })
  findOne(@Query('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @Post('updateById')
  @ApiOperation({ summary: 'Update a todo by ID' })
  update(
    @Request() req: RequestWithUser,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(req.user.id, updateTodoDto);
  }

  @Patch('complete')
  @ApiOperation({ summary: 'Mark a todo as completed' })
  markAsCompleted(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.todosService.markAsCompleted(+id, req.user.id);
  }

  @Delete('delById')
  @ApiOperation({ summary: 'Delete todos by IDs' })
  @HttpCode(HttpStatus.OK)
  remove(@Body('ids') ids: string, @Request() req: RequestWithUser) {
    return this.todosService.remove(ids, req.user.id);
  }
}
