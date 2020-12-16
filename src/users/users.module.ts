import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { RolesEntity } from 'src/roles/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolesEntity, UserRepository]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
