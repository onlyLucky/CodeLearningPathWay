export * from './roles.decorator';
export * from './public.decorator';
export * from './user.decorator';
export * from './throttle.decorator';

/* 
  全局装饰器作用：
  1. 为整个应用添加全局的拦截器、守卫、过滤器等
  2. 定义全局的路由前缀、版本控制等
  3. 配置全局的依赖注入容器，如数据库连接、缓存等
  4. 定义全局的异常处理逻辑，如自定义错误响应格式 
*/