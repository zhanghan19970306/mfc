import { CustomBaseEntity } from '@/shared/entity';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity('sys_perm')
@Tree('materialized-path')
export class Perm extends CustomBaseEntity {
  @Column({ comment: '权限名称', default: '' })
  name: string;

  @Column({ comment: '权限标识', unique: true, default: '' })
  code: string;

  @TreeChildren()
  children: Perm[];

  @TreeParent() // 允许递归删除
  parent: Perm;
}
