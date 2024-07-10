import {
  BadRequestException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Result } from '../result';

@Catch(BadRequestException)
export class BadRequestExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    response.json(Result.error(exception.message));
  }
}

export const badRequestExceptionFilter = new BadRequestExceptionFilter();
