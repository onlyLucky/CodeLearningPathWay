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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UserByIdDto } from './dto';
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
  @Roles(UserRole.ADMIN)
  // Query ?userId=4; Body {userId: 4}; Param /users/detailById/4
  findOne(@Query() userByIdDto: UserByIdDto) {
    return this.usersService.findOne(userByIdDto.userId);
  }

  @Post('updateUserInfo')
  @UseGuards(AuthGuard)
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    if (req.user.id !== updateUserDto.userId) {
      throw new Error('You can only update your own profile');
    }
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('updateAvatar')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  // 声明上传头像接口的请求体格式：multipart/form-data 中字段 avatar 为二进制文件
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
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.usersService.update(req.user.id, { avatar: avatarUrl });
  }

  @Delete('delUser')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Body() userByIdDto: UserByIdDto) {
    return this.usersService.remove(userByIdDto.userId);
  }
}
