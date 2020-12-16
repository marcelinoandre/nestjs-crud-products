import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

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
}
