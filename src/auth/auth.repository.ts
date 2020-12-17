import { UserEntity } from 'src/users/user.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(UserEntity)
export class AuthRepository extends Repository<UserEntity> {}
