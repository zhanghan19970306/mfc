import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PermService } from './perm.service';
import { CreatePermDto } from './dto/create-perm.dto';
import { UpdatePermDto } from './dto/update-perm.dto';
import { Result } from '@/shared/result';

@Controller('/perm')
export class PermController {
  constructor(private readonly permService: PermService) {}

  @Post()
  async create(@Body() createPermDto: CreatePermDto) {
    const result = await this.permService.create(createPermDto);

    return Result.success(result, '创建权限成功');
  }

  @Get('/tree')
  async findTreeAll() {
    const result = await this.permService.findTreeAll();

    return Result.success(result, '获取权限树列表成功');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.permService.findOne(id);

      return Result.success(result, '获取权限信息成功');
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async findAll() {
    const result = await this.permService.findAll();

    return Result.success(result, '获取权限列表成功');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePermDto: UpdatePermDto) {
    const result = await this.permService.update(id, updatePermDto);

    return Result.success(result, '更新权限成功');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.permService.remove(id);

    return Result.success(null, '删除权限成功');
  }
}
