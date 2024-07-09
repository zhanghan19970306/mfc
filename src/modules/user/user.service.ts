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

  findOneById(id: string) {
    return this.userRepository.findOneByOrFail({ id });
  }

  /**
   * 根据用户名查找用户。
   *
   * 本函数旨在通过用户名查询用户信息。它利用了userRepository的findOneByOrFail方法，
   * 这个方法会根据提供的条件（在这里是用户名）查找用户，并期望找到至少一个匹配的用户。
   * 如果没有找到匹配的用户，该方法将抛出一个错误。
   *
   * @param username 用户名，用于查找用户的唯一标识。
   * @returns 返回查找到的用户对象。
   */
  findOneByUsername(username: string) {
    return this.userRepository.findOneByOrFail({ username });
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
