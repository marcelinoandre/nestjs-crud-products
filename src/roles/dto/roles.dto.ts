import { IsEnum } from 'class-validator';
import { RolesEnum } from './../roles.enum';

export class CreateRolesDto {
  @IsEnum(RolesEnum, { message: 'The roles should user or admin' })
  name: string;
}
