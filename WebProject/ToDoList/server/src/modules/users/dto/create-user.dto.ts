import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Is user active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example:
      'Life is like a box of chocolates, you never know what you are going to get.',
    description: 'Personal signature',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  signature?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;
}
