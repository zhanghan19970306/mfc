import { IsArray, IsNotEmpty, ValidateIf, IsString } from 'class-validator';

export class CreatePermDto {
  @ValidateIf((o) => !!o.parentId)
  @IsString({ message: '字段类型错误' })
  readonly parentId?: string;

  @IsString({ message: '字段类型错误' })
  @IsNotEmpty({ message: '权限名称不能为空' })
  readonly name: string;

  @IsString({ message: '字段类型错误' })
  @IsNotEmpty({ message: '权限标识不能为空' })
  readonly code: string;

  @ValidateIf((o) => !!o.children)
  @IsArray({ message: '字段类型错误' })
  readonly children?: CreatePermDto[];
}
