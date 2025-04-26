// src/applications/cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './application.schema';
import { Log, LogDocument } from '@/logs/log.schema';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectModel(Application.name)
    private appModel: Model<ApplicationDocument>,
    @InjectModel(Log.name)
    private logModel: Model<LogDocument>,
  ) {}

  /** Daily cleanup of logs older than retention period */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpLogs() {
    const apps = await this.appModel.find({ logRetentionDays: { $gt: 0 } });

    for (const app of apps) {
      const retentionMs = app.logRetentionDays * 24 * 60 * 60 * 1000; // days to ms
      const cutoffDate = new Date(Date.now() - retentionMs);

      const result = await this.logModel.deleteMany({
        applicationId: app._id,
        timestamp: { $lt: cutoffDate },
      });

      if (result.deletedCount > 0) {
        this.logger.log(
          `Deleted ${result.deletedCount} logs for app ${app.name} older than ${app.logRetentionDays} days.`,
        );
      }
    }
  }
}
