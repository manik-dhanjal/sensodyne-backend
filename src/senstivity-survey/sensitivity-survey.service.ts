import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SensitivitySurvey,
  SensitivitySurveyDocument,
} from './sensitivity-survey.schema';

@Injectable()
export class SensitivitySurveyService {
  constructor(
    @InjectModel(SensitivitySurvey.name)
    private readonly surveyModel: Model<SensitivitySurveyDocument>,
  ) {}

  async create(data: Partial<SensitivitySurvey>): Promise<SensitivitySurvey> {
    const survey = new this.surveyModel(data);
    return survey.save();
  }

  async findAll(): Promise<SensitivitySurvey[]> {
    return this.surveyModel.find().exec();
  }

  async findById(id: string): Promise<SensitivitySurvey | null> {
    return this.surveyModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<SensitivitySurvey[]> {
    return this.surveyModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async updateById(
    id: string,
    update: Partial<SensitivitySurvey>,
  ): Promise<SensitivitySurvey | null> {
    return this.surveyModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<SensitivitySurvey | null> {
    return this.surveyModel.findByIdAndDelete(id).exec();
  }
}
