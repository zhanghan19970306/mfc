import {
  IsArray,
  IsNotEmpty,
  ValidateIf,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdatePermDto {
  @ValidateIf((o) => !!o.id)
  @IsUUID(4, { message: '字段类型错误' })
  readonly id?: string;

  @IsString({ message: '权限名称 字段类型错误' })
  @IsNotEmpty({ message: '权限名称 不能为空' })
  readonly name: string;

  @IsString({ message: '权限标识 字段类型错误' })
  @IsNotEmpty({ message: '权限标识 不能为空' })
  readonly code: string;

  @ValidateIf((o) => !!o.children)
  @IsArray({ message: '子级权限 字段类型错误' })
  readonly children?: UpdatePermDto[];
}
