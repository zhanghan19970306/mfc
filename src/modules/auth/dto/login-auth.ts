import { IsHash, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsMobilePhone(
    'zh-CN',
    { strictMode: false },
    { message: '手机号码格式不正确' },
  )
  @IsNotEmpty({ message: '手机号码不能为空' })
  readonly username: string;

  @IsHash('md5', { message: '密码类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
