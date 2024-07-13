import { Module } from '@nestjs/common';
import { PermService } from './perm.service';
import { PermController } from './perm.controller';
import { Perm } from './entities/perm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Perm])],
  controllers: [PermController],
  providers: [PermService],
})
export class PermModule {}
