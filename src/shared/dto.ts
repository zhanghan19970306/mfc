import { isNotEmpty, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class UpdateDto {
  @ValidateIf((o) => isNotEmpty(o.returnEntity))
  @IsNotEmpty({ message: 'returnEntity类型错误' })
  returnEntity: boolean;
}

export class PaginationDto {
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'pageNumber需要是正整数' },
  )
  @IsNotEmpty({ message: 'pageNumber不能为空' })
  readonly pageNumber: number;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'pageNumber需要是正整数' },
  )
  @IsNotEmpty({ message: 'pageSize不能为空' })
  readonly pageSize: number;
}
