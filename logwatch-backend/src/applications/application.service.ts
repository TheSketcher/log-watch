// ====================== src/applications/application.service.ts
import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { randomBytes } from 'crypto';
import { Application, ApplicationDocument } from './application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name) private appModel: Model<ApplicationDocument>,
  ) {}

  /** Generate a cryptographically‑random 24‑char hex API key */
  private generateApiKey(): string {
    return randomBytes(12).toString('hex'); // 24 chars
  }

  async create(ownerId: Types.ObjectId, dto: CreateApplicationDto) {
    const exists = await this.appModel.exists({ name: dto.name, ownerId });
    if (exists) throw new ConflictException('Application name already in use');

    const app = new this.appModel({
      ...dto,
      apiKey: this.generateApiKey(),
      ownerId,
    });
    return app.save();
  }

  async findAll(ownerId: Types.ObjectId) {
    return this.appModel.find({ ownerId }).lean();
  }

  async findById(ownerId: Types.ObjectId, id: string) {
    const app = await this.appModel.findById(id).lean();
    if (!app) throw new NotFoundException();
    if (!app.ownerId.equals(ownerId)) throw new ForbiddenException();
    return app;
  }

  async findByApiKey(apiKey: string) {
    return this.appModel.findOne({ apiKey }).lean();
  }
}
