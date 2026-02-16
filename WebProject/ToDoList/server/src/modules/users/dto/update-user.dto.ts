import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'uid'] as const),
) {
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
