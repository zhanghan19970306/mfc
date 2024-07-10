import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StatusRoleDto } from './dto/status-role.dto';
import { Result } from '@/shared/result';

@Controller('/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return Result.success(role, '新增角色成功');
  }

  @Get()
  async findAll() {
    const roles = await this.roleService.findAll();
    return Result.success(roles, '获取角色列表成功');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(id);
    return Result.success(role, '获取角色信息成功');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(id, updateRoleDto);
    return Result.success(role, '更新角色信息成功');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.roleService.remove(id);
    return Result.success(null, '删除角色成功');
  }

  @Patch('/status/:id')
  async status(@Param('id') id: string, @Body() statusRoleDto: StatusRoleDto) {
    const result = await this.roleService.status(id, statusRoleDto);
    return Result.success(result, '更新角色状态成功');
  }
}
