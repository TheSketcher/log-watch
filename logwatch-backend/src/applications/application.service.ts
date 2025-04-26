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

  private toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  async create(ownerId: string, dto: CreateApplicationDto) {
    const ownerObjId = this.toObjectId(ownerId);
    const exists = await this.appModel.exists({
      name: dto.name,
      ownerId: ownerObjId,
    });
    if (exists) throw new ConflictException('Application name already in use');

    const app = new this.appModel({
      ...dto,
      apiKey: this.generateApiKey(),
      ownerId: ownerObjId,
    });
    return app.save();
  }

  async findAll(ownerId: string) {
    const ownerObjId = this.toObjectId(ownerId);
    return this.appModel.find({ ownerId: ownerObjId }).lean();
  }

  async findById(ownerId: string, id: string) {
    const ownerObjId = this.toObjectId(ownerId);
    const app = await this.appModel.findById(id).lean();
    if (!app) throw new NotFoundException();
    if (!app.ownerId.equals(ownerObjId)) throw new ForbiddenException();
    return app;
  }

  async findByApiKey(apiKey: string) {
    return this.appModel.findOne({ apiKey }).lean();
  }

  async update(userId: string, appId: string, dto: Partial<Application>) {
    const userObjId = this.toObjectId(userId);
    const app = await this.appModel.findById(appId);

    if (!app) throw new NotFoundException('Application not found');

    if (!app.ownerId.equals(userObjId)) {
      throw new ForbiddenException(
        'You are not allowed to modify this application',
      );
    }

    if (dto.name !== undefined) app.name = dto.name;
    if (dto.status !== undefined) app.status = dto.status;
    if (dto.logRetentionDays !== undefined)
      app.logRetentionDays = dto.logRetentionDays;

    await app.save();
    return app;
  }

  async regenerateApiKey(userId: string, appId: string) {
    const userObjId = this.toObjectId(userId);
    const app = await this.appModel.findById(appId);
    if (!app) throw new NotFoundException('Application not found');

    if (!app.ownerId.equals(userObjId)) {
      throw new ForbiddenException(
        'You are not allowed to regenerate this key',
      );
    }

    app.apiKey = uuidv4().replace(/-/g, '').slice(0, 24);
    await app.save();
    return { apiKey: app.apiKey };
  }

  async delete(userId: string, appId: string) {
    const userObjId = this.toObjectId(userId);
    const app = await this.appModel.findById(appId);

    if (!app) throw new NotFoundException('Application not found');

    if (!app.ownerId.equals(userObjId)) {
      throw new ForbiddenException(
        'You are not allowed to delete this application',
      );
    }

    await app.deleteOne();
    return { message: 'Application deleted successfully' };
  }
}
