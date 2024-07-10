import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const validationPipe = new ValidationPipe({
  /** 转化数据 */
  transform: true,
  /** 白名单过滤 防止前端传输非法字段入库 */
  whitelist: true,
  exceptionFactory(errs) {
    // 多个校验规则错误 只输出一条规则错误信息
    const constraints = errs[0].constraints;

    const keyArr = Object.keys(constraints);

    const msg = constraints[keyArr[0]];

    // 验证错误 走BadRequestException
    throw new BadRequestException(msg, '---请求参数校验错误---');
  },
});
