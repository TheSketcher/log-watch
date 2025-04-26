// ====================== src/applications/application.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  @Patch(':id')
  async updateApp(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    console.log(`PATCH /applications/${id}`, dto);

    return this.appService.update(req.user._id, id, dto);
  }

  /** Regenerate API key */
  @Post(':id/regenerate-key')
  async regenerateKey(@Request() req, @Param('id') id: string) {
    return this.appService.regenerateApiKey(req.user._id, id);
  }
  /** Delete application */
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    console.log(`DELETE /applications/${id}`);
    const app = await this.appService.findById(req.user._id, id);
    if (!app) {
      throw new NotFoundException(
        'Application not found or does not belong to user',
      );
    }
    return this.appService.delete(req.user._id, id);
  }
}
