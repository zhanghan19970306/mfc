import { Injectable } from '@nestjs/common';
import { CreatePermDto } from './dto/create-perm.dto';
import { UpdatePermDto } from './dto/update-perm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Perm } from './entities/perm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermService {
  constructor(
    @InjectRepository(Perm)
    private readonly permRepository: Repository<Perm>,
  ) {}

  async create(createPermDto: CreatePermDto) {
    const perm = this.permRepository.create(createPermDto);

    // 如果选择了父亲权限
    if (createPermDto.parentId) {
      perm.parent = await this.permRepository.findOneBy({
        id: createPermDto.parentId,
      });
    }

    // 保存权限
    await this.permRepository.save(perm);

    // 如果存在子权限 添加子权限
    if (createPermDto.children?.length > 0) {
      const childrenPerms = createPermDto.children.map((item) => {
        const childrenPerm = this.permRepository.create(item);

        childrenPerm.parent = perm;

        return childrenPerm;
      });

      await this.permRepository.save(childrenPerms);
    }

    return this.permRepository.manager
      .getTreeRepository(Perm)
      .findDescendantsTree(perm);
  }

  findTreeAll() {
    return this.permRepository.manager.getTreeRepository(Perm).findTrees();
  }

  findAll() {
    return this.permRepository.find();
  }

  findOne(id: string) {
    return this.permRepository.findOneByOrFail({ id });
  }

  async update(id: string, updatePermDto: UpdatePermDto) {
    const perm = await this.permRepository.findOneByOrFail({ id });

    const permUpdated = this.permRepository.merge(perm, updatePermDto);

    // 保存
    await this.permRepository.save(permUpdated);

    // 存在子权限
    if (updatePermDto.children?.length > 0) {
      const childrenPerms: Perm[] = [];

      for (const item of updatePermDto.children) {
        let childrenPerm: Perm = null;

        if (item.id) {
          const prem = await this.permRepository.findOneBy({ id: item.id });

          childrenPerm = this.permRepository.merge(prem, item);
        } else {
          childrenPerm = this.permRepository.create(item);
        }

        childrenPerm.parent = perm;

        childrenPerms.push(childrenPerm);
      }

      await this.permRepository.save(childrenPerms);
    }

    return this.permRepository.manager
      .getTreeRepository(Perm)
      .findDescendantsTree(perm);
  }

  async remove(id: string) {
    const perm = await this.permRepository.findOneBy({ id });

    const childrens = await this.permRepository.manager
      .getTreeRepository(Perm)
      .findDescendants(perm);

    // 先删除所有子级
    await Promise.all(
      childrens
        .filter((item) => item.id !== perm.id)
        .map((item) => this.permRepository.remove(item)),
    );

    await this.permRepository.remove(perm);
  }
}
