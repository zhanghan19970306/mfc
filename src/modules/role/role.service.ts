import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { StatusRoleDto } from './dto/status-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: string) {
    return this.roleRepository.findOneBy({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOneByOrFail({ id });

    const roleUpdated = this.roleRepository.merge(role, updateRoleDto);

    return this.roleRepository.save(roleUpdated);
  }

  async remove(id: string) {
    const role = await this.roleRepository.findOneByOrFail({ id });

    return this.roleRepository.remove(role);
  }

  async status(id: string, statusRoleDto: StatusRoleDto) {
    const role = await this.roleRepository.findOneByOrFail({ id });

    const roleUpdated = this.roleRepository.merge(role, statusRoleDto);

    return this.roleRepository.save(roleUpdated);
  }
}
