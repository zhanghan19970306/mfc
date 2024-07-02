import { IsNotEmpty } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty({ message: 'pageNumber不能为空' })
  readonly pageNumber: number;

  @IsNotEmpty({ message: 'pageSize不能为空' })
  readonly pageSize: number;
}
