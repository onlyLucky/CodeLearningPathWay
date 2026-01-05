import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
  ParseBoolPipe,
  ParseUUIDPipe,
  ParseArrayPipe,
  DefaultValuePipe,
  UsePipes,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { ParseIntPipe as CustomParseIntPipe } from 'src/pipes/parse-int.pipe';
import { ToLowerCasePipe } from 'src/pipes/to-lower-case.pipe';
import { TrimPipe } from 'src/pipes/trim.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { TimeoutInterceptor } from 'src/interceptors/timeout.interceptor';
import { CacheInterceptor } from 'src/interceptors/cache.interceptor';
import { ExceptionInterceptor } from 'src/interceptors/exception.interceptor';

/**
 * CatsController - 猫咪控制器
 * 处理与猫咪相关的所有HTTP请求
 * 使用了全局异常过滤器 HttpExceptionFilter
 */
@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /**
   * 创建新的猫咪
   * 使用自定义验证管道 ValidationPipe 验证请求体
   * @param createCatDto - 创建猫咪的数据传输对象
   * @returns 创建的猫咪信息
   */
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  /**
   * 获取所有猫咪列表
   * @returns 所有猫咪的数组
   */
  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  /**
   * 使用内置 ParseIntPipe 获取单个猫咪
   * ParseIntPipe 会自动将路由参数从字符串转换为整数
   * @param id - 猫咪ID（自动转换为整数）
   * @returns 找到的猫咪信息
   */
  @Get('builtin/int/:id')
  findOneWithBuiltinParseInt(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  /**
   * 使用内置 ParseFloatPipe 演示浮点数解析
   * ParseFloatPipe 会自动将字符串参数转换为浮点数
   * @param value - 浮点数值（自动转换）
   * @returns 包含浮点数的响应
   */
  @Get('builtin/float/:value')
  findOneWithBuiltinParseFloat(@Param('value', ParseFloatPipe) value: number) {
    return `Float value: ${value}`;
  }

  /**
   * 使用内置 ParseBoolPipe 演示布尔值解析
   * ParseBoolPipe 会将字符串 'true'/'false'、'1'/'0' 等转换为布尔值
   * @param flag - 布尔标志（自动转换）
   * @returns 包含布尔值的响应
   */
  @Get('builtin/bool/:flag')
  findOneWithBuiltinParseBool(@Param('flag', ParseBoolPipe) flag: boolean) {
    return `Boolean flag: ${flag}`;
  }

  /**
   * 使用内置 ParseUUIDPipe 演示 UUID 解析
   * ParseUUIDPipe 会验证字符串是否符合 UUID 格式
   * @param uuid - UUID 字符串（自动验证）
   * @returns 包含 UUID 的响应
   */
  @Get('builtin/uuid/:uuid')
  findOneWithBuiltinParseUUID(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return `UUID: ${uuid}`;
  }

  /**
   * 使用内置 ParseArrayPipe 演示数组解析
   * ParseArrayPipe 会将逗号分隔的字符串转换为数组
   * 例如: ?ids=1,2,3 -> [1, 2, 3]
   * @param ids - ID 数组（自动解析）
   * @returns 包含数组的响应
   */
  @Get('builtin/array')
  findOneWithBuiltinParseArray(@Query('ids', ParseArrayPipe) ids: string[]) {
    return `Array of IDs: ${ids.join(', ')}`;
  }

  /**
   * 使用内置 DefaultValuePipe 演示默认值设置
   * DefaultValuePipe 会在参数未提供时使用默认值
   * @param page - 页码（默认为 1）
   * @param limit - 每页数量（默认为 10）
   * @returns 包含分页参数的响应
   */
  @Get('builtin/default')
  findOneWithBuiltinDefaultValue(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    return `Page: ${page}, Limit: ${limit}`;
  }

  /**
   * 使用自定义 ParseIntPipe 获取单个猫咪
   * 演示如何使用自定义管道替代内置管道
   * @param id - 猫咪ID（通过自定义管道转换为整数）
   * @returns 找到的猫咪信息
   */
  @Get('custom/int/:id')
  findOneWithCustomParseInt(@Param('id', CustomParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  /**
   * 使用自定义 ToLowerCasePipe 演示字符串转换
   * ToLowerCasePipe 会将字符串转换为小写
   * @param name - 猫咪名称（自动转换为小写）
   * @returns 包含小写名称的响应
   */
  @Get('custom/lowercase/:name')
  findOneWithToLowerCase(@Param('name', ToLowerCasePipe) name: string) {
    return `Name in lowercase: ${name}`;
  }

  /**
   * 使用自定义 TrimPipe 演示字符串修剪
   * TrimPipe 会去除字符串首尾的空格
   * @param value - 待处理的字符串（自动去除首尾空格）
   * @returns 包含修剪后字符串的响应
   */
  @Get('custom/trim/:value')
  findOneWithTrim(@Param('value', TrimPipe) value: string) {
    return `Trimmed value: "${value}"`;
  }

  /**
   * 演示多个管道的组合使用
   * 路由参数使用 CustomParseIntPipe，查询参数使用 TrimPipe 和 ToLowerCasePipe
   * 多个管道按顺序执行，前一个管道的输出作为后一个管道的输入
   * @param id - 猫咪ID（转换为整数）
   * @param name - 猫咪名称（先去除空格，再转为小写）
   * @returns 包含处理后的参数的响应
   */
  @Get('combined/:id')
  findOneWithMultiplePipes(
    @Param('id', CustomParseIntPipe) id: number,
    @Query('name', TrimPipe, ToLowerCasePipe) name: string,
  ) {
    return `ID: ${id}, Name: ${name}`;
  }

  /**
   * 根据ID获取单个猫咪
   * 使用手动类型转换（+id 将字符串转为数字）
   * @param id - 猫咪ID（字符串）
   * @returns 找到的猫咪信息
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(+id);
  }

  /**
   * 更新猫咪信息
   * @param id - 猫咪ID（字符串）
   * @param updateCatDto - 更新猫咪的数据传输对象
   * @returns 更新后的猫咪信息
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  /**
   * 删除猫咪
   * @param id - 猫咪ID（字符串）
   * @returns 删除结果
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }

  /**
   * 使用 AuthGuard 演示基本认证
   * 需要在请求头中提供 Authorization: Bearer <token>
   * @returns 认证成功信息
   */
  @Get('guard/auth')
  @UseGuards(AuthGuard)
  protectedRoute() {
    return 'This route is protected by AuthGuard';
  }

  /**
   * 使用 RolesGuard 演示基于角色的访问控制
   * 只有 admin 角色的用户才能访问
   * @returns 管理员专属信息
   */
  @Get('guard/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  adminOnly() {
    return 'This route is only for admins';
  }

  /**
   * 使用 RolesGuard 演示多角色访问控制
   * admin 或 user 角色都可以访问
   * @returns 多角色可访问的信息
   */
  @Get('guard/multi-role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'user')
  adminOrUser() {
    return 'This route is accessible by admins and users';
  }

  /**
   * 使用自定义 User 装饰器获取用户信息
   * 演示如何从请求中提取用户数据
   * @param user - 当前登录用户对象
   * @returns 用户信息
   */
  @Get('guard/user-info')
  @UseGuards(AuthGuard)
  getUserInfo(@User() user: any): any {
    return user;
  }

  /**
   * 使用自定义 User 装饰器获取用户的特定属性
   * 演示如何从用户对象中提取特定字段
   * @param userId - 用户ID
   * @returns 用户ID
   */
  @Get('guard/user-id')
  @UseGuards(AuthGuard)
  getUserId(@User('id') userId: string) {
    return { userId };
  }

  /**
   * 使用 LoggingInterceptor 演示日志拦截器
   * 拦截器会在请求处理前后记录日志，并计算执行时间
   * @returns 带有日志的响应
   */
  @Get('interceptor/logging')
  @UseInterceptors(LoggingInterceptor)
  loggingDemo() {
    return 'This route uses LoggingInterceptor';
  }

  /**
   * 使用 TransformInterceptor 演示响应转换拦截器
   * 拦截器会将响应数据包装在 { data: ... } 格式中
   * @returns 被转换后的响应
   */
  @Get('interceptor/transform')
  @UseInterceptors(TransformInterceptor)
  transformDemo() {
    return { message: 'This route uses TransformInterceptor' };
  }

  /**
   * 使用 TimeoutInterceptor 演示超时拦截器
   * 拦截器会为请求设置5秒超时限制
   * 如果请求处理时间超过5秒，会抛出 RequestTimeoutException
   * @returns 响应（如果在超时时间内完成）
   */
  @Get('interceptor/timeout')
  @UseInterceptors(TimeoutInterceptor)
  timeoutDemo() {
    return 'This route uses TimeoutInterceptor';
  }

  /**
   * 使用 CacheInterceptor 演示缓存拦截器
   * 拦截器会缓存响应数据，提高性能
   * 第一次请求会执行实际处理，后续请求会返回缓存结果
   * @returns 响应（可能来自缓存）
   */
  @Get('interceptor/cache')
  @UseInterceptors(CacheInterceptor)
  cacheDemo() {
    return {
      message: 'This route uses CacheInterceptor',
      timestamp: Date.now(),
    };
  }

  /**
   * 使用 ExceptionInterceptor 演示异常拦截器
   * 拦截器会捕获并标准化异常响应格式
   * @returns 标准化的错误响应
   */
  @Get('interceptor/exception')
  @UseInterceptors(ExceptionInterceptor)
  exceptionDemo() {
    throw new Error('This is a test exception');
  }

  /**
   * 演示多个拦截器的组合使用
   * 多个拦截器按顺序执行，形成一个拦截器链
   * 这里组合了日志、转换、缓存和异常拦截器
   * @returns 经过多个拦截器处理的响应
   */
  @Get('interceptor/combined')
  @UseInterceptors(
    LoggingInterceptor,
    TransformInterceptor,
    CacheInterceptor,
    ExceptionInterceptor,
  )
  combinedInterceptorsDemo() {
    return { message: 'This route uses multiple interceptors' };
  }

  /**
   * 演示在方法级别使用拦截器
   * 只有这个特定的路由会使用指定的拦截器
   * @returns 响应
   */
  @Get('interceptor/method-level')
  @UseInterceptors(LoggingInterceptor)
  methodLevelInterceptor() {
    return 'This route has a method-level interceptor';
  }
}
