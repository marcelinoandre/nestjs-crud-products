import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/roles/role.entity';
import { RolesEnum } from 'src/roles/roles.enum';
import { RolesRepository } from 'src/roles/roles.repository';
import { UserEntity } from 'src/users/user.entity';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: RolesRepository,
    @InjectRepository(UserEntity)
    private readonly authRepository: AuthRepository,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return await this.authRepository.find();
  }

  async create(signInDto: SignInDto) {
    const { email } = signInDto;
    const exists = await this.authRepository.findOne({
      where: [{ email }],
    });

    console.log(exists);

    if (exists) throw new ConflictException();

    const rolesUser = await this.rolesRepository.findOne({
      where: { name: RolesEnum.USER },
    });
    if (!rolesUser) throw new InternalServerErrorException();
    const userAdmin = this.authRepository.create(signInDto);
    userAdmin.roles = [rolesUser];
    return await this.authRepository.save(userAdmin);
  }
}
