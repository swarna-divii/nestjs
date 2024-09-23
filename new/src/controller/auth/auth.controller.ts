import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../../model/auth/auth.service';
import { AuthDto } from '../../model/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}