// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const userN = await this.usersService.findByUsername(body.username);
    if (!userN) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(body.password, userN.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // Dummy-Token (später JWT)
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) throw new UnauthorizedException();

    return this.authService.login(user);
  }
}
