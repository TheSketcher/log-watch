// src/users/users.controller.ts

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body) {
    const { username, email } = body;
    return await this.usersService.createUser(username, email);
  }

  @Get()
  async getAll() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
