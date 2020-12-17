import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_SYNCRONIZE,
  DB_USER,
} from 'src/config/constants';
import { ProductEntity } from 'src/products/product.entity';
import { RolesEntity } from 'src/roles/role.entity';
import { UserEntity } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(DB_HOST),
        port: +configService.get<number>(DB_PORT),
        username: configService.get(DB_USER),
        password: configService.get(DB_PASSWORD),
        database: configService.get(DB_DATABASE),
        entities: [ProductEntity, RolesEntity, UserEntity],
        synchronize: configService.get(DB_SYNCRONIZE),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
