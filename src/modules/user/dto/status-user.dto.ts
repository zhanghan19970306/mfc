import { IsBoolean } from 'class-validator';

export class StatusUserDto {
  @IsBoolean({ message: 'disabled字段类型错误' })
  readonly disabled: boolean;
}
