import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsInt,
  Min as MinValue,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username!: string;

  @ApiProperty({
    example: '123456789',
    description: 'User unique ID (like QQ number)',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  uid!: string;

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

  @ApiPropertyOptional({
    example: 100,
    description: 'User points',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @MinValue(0)
  points?: number;
}
