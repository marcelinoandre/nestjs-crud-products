import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignInDto } from './dto/signin.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAll() {
    return this.authService.getAll();
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('signin')
  create(@Body() signDto: SignInDto) {
    return this.authService.create(signDto);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() tokenDto: TokenDto) {
    return this.authService.refreshToken(tokenDto);
  }
}
