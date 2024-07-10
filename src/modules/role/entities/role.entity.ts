import { CustomBaseEntity } from '@/shared/entity';
import { Column, Entity } from 'typeorm';

@Entity('sys_role')
export class Role extends CustomBaseEntity {
  @Column({ comment: '角色名', unique: true })
  name: string;

  @Column({ comment: '角色Code', unique: true })
  code: string;

  @Column({ comment: '描述', default: '' })
  desc: string;

  @Column({ comment: '是否启用', default: false })
  disabled: boolean;

  @Column({ comment: '标签颜色', default: '' })
  color: string;
}
