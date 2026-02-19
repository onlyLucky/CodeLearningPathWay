import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @ApiProperty({
    example: 1,
    description: 'User role (0 for GUEST, 1 for USER, 2 for ADMIN)',
  })
  @IsNumber()
  type!: number;
}
