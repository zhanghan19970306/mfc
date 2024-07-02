import { ResponseJson } from './interface';

const codeMap = new Map<number, string>([
  [0, '请求成功'],
  [1, '请求错误'],
  [2, '登录失效，请重新登录'],
]);

export class Result {
  /** 请求成功 */
  static success<T = null>(data: T = null, msg?: string): ResponseJson<T> {
    return {
      code: 0,
      msg: msg ? msg : codeMap.get(0),
      data,
    };
  }

  /** 请求错误 */
  static error(msg?: string): ResponseJson<null> {
    return {
      code: 1,
      msg: msg ? msg : codeMap.get(1),
      data: null,
    };
  }

  /**
   * auth_token失效的时候使用
   */
  static unAuth: ResponseJson<null> = {
    code: 2,
    msg: codeMap.get(1),
    data: null,
  };
}
