import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 创建新实体
    const user = this.userRepository.create(createUserDto);

    // 用户的手机号 就是登录账号
    user.username = user.mobile;

    /**
     * 如果用户没有填写昵称 给默认昵称
     * 默认昵称格式：游客000000001
     */
    if (!user.nickname) {
      const count = await this.userRepository.count();
      const countStr = String(count);
      user.nickname = `游客${countStr.padStart(9 - countStr.length, '0')}`;
    }

    // 入库
    const userEntity = await this.userRepository.save(user);

    return userEntity;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
