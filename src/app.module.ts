import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  DB_SYNCRONIZE,
} from './config/constants';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { RulesModule } from './rules/rules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(DB_HOST),
        port: +configService.get<number>(DB_PORT),
        username: configService.get(DB_USER),
        password: configService.get(DB_PASSWORD),
        database: configService.get(DB_DATABASE),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get(DB_SYNCRONIZE),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    RulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
