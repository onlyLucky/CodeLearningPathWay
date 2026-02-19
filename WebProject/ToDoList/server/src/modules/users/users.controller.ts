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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.constant';
import { Request as ExpressRequest } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage, fileFilter } from '../../config/multer.config';

interface RequestWithUser extends ExpressRequest {
  user: {
    id: number;
    username: string;
    email: string;
    role: UserRole;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('detailById')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== +id) {
      throw new Error('You can only update your own profile');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Post(':id/avatar')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== +id) {
      throw new BadRequestException('You can only update your own avatar');
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.usersService.update(+id, { avatar: avatarUrl });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
