import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries', description: 'Todo title' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'Milk, eggs, bread',
    description: 'Todo description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    example: '0',
    description: 'Todo status: 0=pending, 1=in_progress, 2=completed',
    enum: ['0', '1', '2'],
    default: '0',
  })
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  status?: '0' | '1' | '2';

  @ApiPropertyOptional({
    example: '1',
    description: 'Priority level: 0=low, 1=medium, 2=high',
    enum: ['0', '1', '2'],
    default: '1',
  })
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  priority?: '0' | '1' | '2';

  @ApiPropertyOptional({
    example: '2024-12-31 12:00:00',
    description: 'Deadline time',
  })
  @IsOptional()
  @IsDateString()
  deadlineTime?: string;

  @ApiPropertyOptional({
    example: '1',
    description:
      'Reminder type: 0=none, 1=every day, 2=every week, 3=every month, 4=every year',
    enum: ['0', '1', '2', '3', '4'],
    default: '0',
  })
  @IsOptional()
  @IsEnum(['0', '1', '2', '3', '4'])
  reminderType?: '0' | '1' | '2' | '3' | '4';

  @ApiPropertyOptional({
    example: '2024-12-31 12:00:00',
    description: 'Reminder time',
  })
  @IsOptional()
  @IsDateString()
  reminderTime?: string;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({ example: 1, description: 'Todo ID' })
  @IsInt()
  @Min(1)
  id!: number;
}

export class QueryTodoDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageNum?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per pagesize' })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Deadline time' })
  @IsOptional()
  @IsString()
  deadlineTime?: string;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Reminder time' })
  @IsOptional()
  @IsString()
  reminderTime?: string;

  @ApiPropertyOptional({ example: '1', description: 'Reminder type' })
  @IsOptional()
  @IsEnum(['0', '1', '2', '3', '4'])
  reminderType?: '0' | '1' | '2' | '3' | '4';

  @ApiPropertyOptional({ example: '0', description: 'Todo status' })
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  status?: '0' | '1' | '2';

  @ApiPropertyOptional({ example: '1', description: 'Priority level' })
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  priority?: '0' | '1' | '2';

  @ApiPropertyOptional({ example: 'Buy groceries', description: 'Todo title' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    example: 'Milk, eggs, bread',
    description: 'Todo description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'createdTime', description: 'Sort by field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Sort order: ASC or DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
