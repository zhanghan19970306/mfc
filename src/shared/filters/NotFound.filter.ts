import {
  NotFoundException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Result } from '../result';

@Catch(NotFoundException)
export class NotFoundExceptionFilter
  implements ExceptionFilter<NotFoundException>
{
  catch(_exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.json(Result.error('没有找到相关数据'));
  }
}

export const notFoundExceptionFilter = new NotFoundExceptionFilter();
