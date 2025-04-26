// ====================== src/applications/application.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { CleanupService } from './cleanup.service';
import { Log, LogSchema } from '@/logs/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Log.name, schema: LogSchema }, // <- Ensure this is here!
    ]),
  ],
  providers: [ApplicationService, CleanupService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule {}
