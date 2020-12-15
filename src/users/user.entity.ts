import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RolesEntity } from '../rules/role.entity';
@Entity('users')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(
    type => RolesEntity,
    roles => roles.users,
    { eager: true },
  )
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'roles_id' },
  })
  roles: RolesEntity[];
}
