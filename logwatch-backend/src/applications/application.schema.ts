// ====================== src/applications/application.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Application {
  @Prop({ required: true, unique: true, maxlength: 64 })
  name: string;

  @Prop({ maxlength: 256 })
  comment?: string;

  @Prop({ required: true, unique: true, minlength: 24, maxlength: 24 })
  apiKey: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId; // reference to the user who created the app
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
ApplicationSchema.index({ name: 1, ownerId: 1 }, { unique: true });
