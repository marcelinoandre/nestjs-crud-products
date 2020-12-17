import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { RolesEntity } from 'src/roles/role.entity';
import { RolesEnum } from 'src/roles/roles.enum';
import { RolesRepository } from 'src/roles/roles.repository';
import { UserEntity } from 'src/users/user.entity';
import { AuthRepository } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/signin.dto';
import { TokenDto } from './dto/token.dto';
import { PayloadInterface } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: RolesRepository,
    @InjectRepository(UserEntity)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException();

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) throw new NotFoundException();

    const payload: PayloadInterface = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map(rol => rol.name as RolesEnum),
    };

    const token = this.jwtService.sign(payload);
    return { token };
  }

  async refreshToken(dto: TokenDto) {
    const user = await this.jwtService.decode(dto.token);
    const payload: PayloadInterface = {
      id: user['id'],
      name: user['name'],
      email: user['email'],
      roles: user['roles'],
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
