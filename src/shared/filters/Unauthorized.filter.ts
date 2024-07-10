import {
  UnauthorizedException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Result } from '../result';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter
  implements ExceptionFilter<UnauthorizedException>
{
  catch(_exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    response.json(Result.unAuth);
  }
}

export const unauthorizedExceptionFilter = new UnauthorizedExceptionFilter();
