import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsJWT({ message: 'refreshToken格式化不正确' })
  @IsNotEmpty({ message: 'refreshToken不能为空' })
  readonly refreshToken: string;
}
