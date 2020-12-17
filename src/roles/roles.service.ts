import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRolesDto } from './dto/roles.dto';
import { RolesEntity } from './role.entity';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: RolesRepository,
  ) {}

  async getAll(): Promise<RolesEntity[]> {
    const roles = await this.rolesRepository.find();
    if (!roles.length) throw new NotFoundException();

    return roles;
  }

  async create(createRolesDto: CreateRolesDto): Promise<CreateRolesDto> {
    const isExistsRoles = await this.rolesRepository.findOne({
      where: { name: createRolesDto.name },
    });

    if (isExistsRoles) throw new ConflictException();

    return await this.rolesRepository.save(createRolesDto as RolesEntity);
  }
}
