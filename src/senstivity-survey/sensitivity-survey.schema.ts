import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose, Types } from 'mongoose';
import { SensitiveTeeth } from './enum/sensitive-teeth.enum';
import { User } from 'src/user/user.schema';

export type SensitivitySurveyDocument = SensitivitySurvey & Document;

@Schema({ timestamps: true })
export class SensitivitySurvey {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: SensitiveTeeth })
  sensitiveTeeth: SensitiveTeeth;

  @Prop({ required: true })
  mobile: number;

  @Prop({ required: true })
  saleAmount: number;

  @Prop({ required: true })
  villageCode: string;

  @Prop({ required: true, ref: User.name })
  userId: Types.ObjectId;
}

export const SensitivitySurveySchema =
  SchemaFactory.createForClass(SensitivitySurvey);
