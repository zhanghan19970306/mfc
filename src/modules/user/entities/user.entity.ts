import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entity';
import { SexEnum } from '@/common/enums';

@Entity('sys_user')
export class User extends BaseEntity {
  @Column({ comment: '用户账号', default: '' })
  username: string;

  @Column({ comment: '密码', default: '' })
  password: string;

  @Column({ comment: '用户昵称', default: '' })
  nickname: string;

  @Column({ comment: '性别', default: SexEnum.Unknown })
  sex: number;

  @Column({ comment: '用户头像', default: '' })
  avatar: string;

  @Column({ comment: '手机号', default: '' })
  mobile: string;

  @Column({ comment: '最后一次登录IP', default: '' })
  lastLoginIp: string;

  @Column({ comment: '登录次数', default: 0 })
  loginCount: number;

  @Column({ comment: '是否禁用', default: false })
  disabled: boolean;
}
