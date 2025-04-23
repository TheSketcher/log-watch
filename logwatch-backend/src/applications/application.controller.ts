// ====================== src/applications/application.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // adjust to your auth guard path

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateApplicationDto) {
    return this.appService.create(req.user._id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.appService.findAll(req.user._id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.appService.findById(req.user._id, id);
  }
}
