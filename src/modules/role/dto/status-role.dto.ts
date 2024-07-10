import { IsBoolean } from 'class-validator';

export class StatusRoleDto {
  @IsBoolean({ message: 'disabled 字段类型错误' })
  readonly disabled: boolean;
}
