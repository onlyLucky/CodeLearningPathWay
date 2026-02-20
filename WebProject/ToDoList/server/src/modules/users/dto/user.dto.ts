import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { UserRole, USER_ROLES } from '../../../common/constants/roles.constant';

export class CreateUserDto {
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
  @Min(0)
  points?: number;

  @ApiPropertyOptional({
    example: UserRole.USER,
    description: 'User role',
    default: UserRole.USER,
  })
  @IsOptional()
  @IsString()
  @IsIn(USER_ROLES)
  role?: UserRole;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'uid'] as const),
) {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({
    example: 'newpassword123',
    description: 'New password',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;

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
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;
}

export class UserByIdDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsInt()
  @Min(1)
  userId!: number;
}
