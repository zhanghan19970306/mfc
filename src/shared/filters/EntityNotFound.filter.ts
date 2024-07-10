import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Result } from '../result';

@Catch()
export class EntityNotFoundExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    if (exception?.name === 'EntityNotFound') {
      response.json(Result.error('没有找到相关数据'));
    }
  }
}

export const EntityNotFoundExceptionFilter =
  new EntityNotFoundExceptionsFilter();
