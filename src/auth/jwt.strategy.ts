import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from 'src/config/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from './payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) // private readonly jwtService: JwtService,
  {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: PayloadInterface) {
    const { email } = payload;

    const user = await this.authRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException();

    return payload;
  }
}
