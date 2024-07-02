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
  async findOne(@Param('id') id: string) {
    const userVo = await this.userService.findOne(id);
    return Result.success(userVo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const userVo = await this.userService.remove(id);
    return userVo;
  }

  /** 分页查询 */
  async findPagination(@Body() pagination: RecordUserDto) {
    return this.userService.findPagination(pagination);
  }
}
