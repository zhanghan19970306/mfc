import {
  IsBoolean,
  IsEnum,
  IsHash,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Max,
  ValidateIf,
} from 'class-validator';
import { SexEnum } from '@/shared/enums';

export class CreateUserDto {
  @IsMobilePhone(
    'zh-CN',
    { strictMode: false },
    { message: '手机号码格式不正确' },
  )
  @IsNotEmpty({ message: '手机号码不能为空' })
  readonly mobile: string;

  @IsHash('md5', { message: '密码类型错误' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @IsBoolean({ message: 'disabled字段类型错误' })
  readonly disabled: boolean;

  @ValidateIf((o) => !!o.userName)
  @Max(10, { message: '用户昵称最多10个字' })
  @IsString({ message: 'userName字段类型错误' })
  readonly nickname?: string;

  @ValidateIf((o) => !!o.sex)
  @IsEnum(SexEnum, { message: '性别类型错误' })
  readonly sex?: SexEnum;
}
