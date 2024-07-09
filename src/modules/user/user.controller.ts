import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RecordUserDto } from './dto/record-user.dto';
import { Result } from '@/shared/result';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userVo = await this.userService.create(createUserDto);
    return Result.success(userVo);
  }

  @Get()
  async findAll() {
    const userVo = await this.userService.findAll();
    return Result.success(userVo);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const userVo = await this.userService.findOneById(id);
    return Result.success(userVo);
  }

  @Get('/user/:username')
  async findOneByUsername(@Param('username') username: string) {
    const userVo = await this.userService.findOneByUsername(username);
    return Result.success(userVo);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);

    if (updateUserDto.returnEntity) {
      return Result.success(user);
    }

    return Result.success();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
    return Result.success();
  }

  /** 分页查询 */
  async findPagination(@Body() pagination: RecordUserDto) {
    return this.userService.findPagination(pagination);
  }
}
