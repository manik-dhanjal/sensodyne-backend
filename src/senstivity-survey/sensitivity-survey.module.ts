import { Module } from '@nestjs/common';
import {
  SensitivitySurvey,
  SensitivitySurveySchema,
} from './sensitivity-survey.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SensitivitySurveyController } from './sensitivity-survey.controller';
import { SensitivitySurveyService } from './sensitivity-survey.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensitivitySurvey.name, schema: SensitivitySurveySchema },
    ]),
    UserModule,
  ],
  controllers: [SensitivitySurveyController],
  providers: [SensitivitySurveyService],
  exports: [SensitivitySurveyService],
})
export class SensitivitySurveyModule {}
