import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserWithRoles {
  [key: string]: unknown;
  roles?: string[];
}

interface RequestWithUser {
  user?: UserWithRoles;
}

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
