import { CreateSensitivitySurveyDto } from './create-sensitivity-survey.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateSensitivitySurveyDto extends PartialType(
  CreateSensitivitySurveyDto,
) {}
