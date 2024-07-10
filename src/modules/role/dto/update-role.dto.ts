import {
  IsBoolean,
  IsNotEmpty,
  ValidateIf,
  IsHexColor,
  IsString,
} from 'class-validator';

export class UpdateRoleDto {
  @IsString({ message: '字段类型错误' })
  @IsNotEmpty({ message: '角色名不能为空' })
  readonly name: string;

  @ValidateIf((o) => !!o.isEnable)
  @IsBoolean({ message: '字段类型错误' })
  readonly disabled: boolean;

  @IsString({ message: '字段类型错误' })
  readonly desc: string;

  @IsHexColor({ message: '标签颜色格式不正确' })
  @IsString({ message: '字段类型错误' })
  readonly color: string;
}
