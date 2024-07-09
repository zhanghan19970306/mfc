import {
  IsBoolean,
  IsEnum,
  IsString,
  Max,
  ValidateIf,
  isNotEmpty,
} from 'class-validator';
import { SexEnum } from '@/shared/enums';
import { UpdateDto } from '@/shared/dto';

export class UpdateUserDto extends UpdateDto {
  @ValidateIf((o) => !!o.userName)
  @Max(10, { message: '用户昵称最多10个字' })
  @IsString({ message: 'userName字段类型错误' })
  readonly nickname?: string;

  @ValidateIf((o) => !!o.sex)
  @IsEnum(SexEnum, { message: '性别类型错误' })
  readonly sex?: SexEnum;

  @ValidateIf((o) => isNotEmpty(o.disabled))
  @IsBoolean({ message: 'disabled字段类型错误' })
  readonly disabled?: boolean;

  @ValidateIf((o) => !!o.avatar)
  @IsString({ message: 'avatar类型错误' })
  readonly avatar?: string;
}
