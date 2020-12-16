import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from '../roles/role.entity';
import { RolesEnum } from 'src/roles/roles.enum';
import { RolesRepository } from 'src/roles/roles.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: RolesRepository,
    @InjectRepository(UserEntity)
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(): Promise<CreateUserDto[]> {
    return await this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const { name, email } = createUserDto;
    const exists = await this.userRepository.findOne({
      where: [{ email }],
    });
    if (exists) throw new ConflictException();
    const rolesAdmin = await this.rolesRepository.findOne({
      where: { name: RolesEnum.ADMIN },
    });
    const rolesUser = await this.rolesRepository.findOne({
      where: { name: RolesEnum.USER },
    });

    if (!rolesAdmin || !rolesUser) throw new InternalServerErrorException();

    const userAdmin = this.userRepository.create(createUserDto);
    userAdmin.roles = [rolesAdmin, rolesUser];
    return await this.userRepository.save(userAdmin);

    // const user = this.userRepository.create(createUserDto);
    // return await this.userRepository.save(user);
  }
}
