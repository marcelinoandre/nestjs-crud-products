import { UserEntity } from '../users/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from './roles.enum';

@Entity('roles')
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: RolesEnum;

  @ManyToMany(
    () => UserEntity,
    usuario => usuario.roles,
  )
  users: UserEntity[];
}
