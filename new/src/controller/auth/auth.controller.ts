import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../../model/auth/auth.service';
import { AuthDto } from '../../model/auth/auth.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  async adminRoute() {
    return 'This is an admin-only route';
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async userRoute() {
    return 'This route is protected for authenticated users';
  }
}
