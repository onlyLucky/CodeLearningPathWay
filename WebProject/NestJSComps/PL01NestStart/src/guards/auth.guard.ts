import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

interface HeadersWithAuthorization {
  authorization?: string;
}

interface RequestWithHeaders {
  headers: HeadersWithAuthorization;
  user?: {
    [key: string]: unknown;
    roles?: string[];
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: RequestWithHeaders): boolean {
    const { headers } = request;
    const authHeader = headers.authorization;

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }

    return this.validateToken(token);
  }

  private validateToken(token: string): boolean {
    return token.length > 0;
  }
}
