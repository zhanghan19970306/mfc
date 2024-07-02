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
    const user = this.userRepository.create(createUserDto);

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

    const userEntity = await this.userRepository.save(user);

    return userEntity;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneByOrFail({ id });
    const updateduser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updateduser);
  }

  async remove(id: string) {
    // 根据id获取到实体
    const user = await this.userRepository.findOneByOrFail({ id });
    return this.userRepository.remove(user);
  }

  async findPagination(params: any) {
    this.userRepository.findAndCount({
      take: params.pageSize,
      skip: (params.pageNo - 1) * params.pageSize,
    });
  }
}
