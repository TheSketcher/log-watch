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
import { v4 as uuidv4 } from 'uuid';

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
      dto,
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
  async update(userId: string, appId: string, dto: Partial<Application>) {
    const app = await this.appModel.findById(appId);

    if (!app) throw new NotFoundException('Application not found');

    // Verify ownership
    if (app.ownerId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        'You are not allowed to modify this application',
      );
    }

    // Apply updates
    if (dto.name !== undefined) app.name = dto.name;
    if (dto.status !== undefined) app.status = dto.status;

    await app.save();
    return app;
  }

  async regenerateApiKey(userId: string, appId: string) {
    const app = await this.appModel.findOne({
      _id: appId,
      userId: new Types.ObjectId(userId),
    });
    if (!app) throw new NotFoundException('Application not found');

    app.apiKey = uuidv4().replace(/-/g, '').slice(0, 24);
    await app.save();
    return { apiKey: app.apiKey };
  }
}
