import {
  IsBoolean,
  IsNotEmpty,
  ValidateIf,
  IsHexColor,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: '角色名 字段类型错误' })
  @IsNotEmpty({ message: '角色名不能为空' })
  readonly name: string;

  @IsString({ message: '角色Code 字段类型错误' })
  @IsNotEmpty({ message: '角色Code不能为空' })
  readonly code: string;

  @ValidateIf((o) => !!o.isEnable)
  @IsBoolean({ message: '角色禁用状态 字段类型错误' })
  readonly disabled: boolean;

  @ValidateIf((o) => !!o.desc)
  @IsString({ message: '角色描述 字段类型错误' })
  readonly desc: string;

  @ValidateIf((o) => !!o.color)
  @IsHexColor({ message: '标签颜色格式不正确' })
  readonly color: string;
}
