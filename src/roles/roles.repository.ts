import { EntityRepository, Repository } from 'typeorm';
import { RolesEntity } from './role.entity';

@EntityRepository(RolesEntity)
export class RolesRepository extends Repository<RolesEntity> {}
