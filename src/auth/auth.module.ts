import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { RolesEntity } from 'src/roles/role.entity';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolesEntity, AuthRepository]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
