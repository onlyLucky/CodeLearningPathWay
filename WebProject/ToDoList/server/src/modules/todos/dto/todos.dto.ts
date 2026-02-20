import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDateString,
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
    example: 'low',
    description: 'Priority level',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({ example: '2024-12-31', description: 'Due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiPropertyOptional({
    example: '2',
    description: 'Todo status: 0=pending, 1=in_progress, 2=completed',
    enum: ['0', '1', '2'],
  })
  @IsOptional()
  @IsEnum(['0', '1', '2'])
  status?: '0' | '1' | '2';
}
