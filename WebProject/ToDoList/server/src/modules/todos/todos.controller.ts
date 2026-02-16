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
import { CreateTodoDto, UpdateTodoDto } from './dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { Public } from '../../common/decorators/public.decorator';

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

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() req: RequestWithUser,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(req.user.id, createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos for the current user' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'in_progress', 'completed'],
  })
  findAll(@Request() req: RequestWithUser, @Query('status') status?: string) {
    return this.todosService.findAll(req.user.id, status);
  }

  @Get('statistics')
  @Public()
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific todo by ID' })
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.todosService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo by ID' })
  update(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(+id, req.user.id, updateTodoDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a todo as completed' })
  markAsCompleted(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.todosService.markAsCompleted(+id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.todosService.remove(+id, req.user.id);
  }
}
