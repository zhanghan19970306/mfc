import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Transform } from 'class-transformer';

export class CustomBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'id' })
  id: string;

  @Transform(({ value }) => new Date(value).getTime())
  @CreateDateColumn({ comment: '创建时间' })
  createdTime: Date;

  @Transform(({ value }) => new Date(value).getTime())
  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;

  findPagination() {}
}
