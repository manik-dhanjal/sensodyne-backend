import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsMongoId,
  Min,
  Matches,
  Max,
} from 'class-validator';
import { SensitiveTeeth } from '../enum/sensitive-teeth.enum';

export class CreateSensitivitySurveyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1, { message: 'Age must be greater than 1' })
  age: number;

  @IsEnum(SensitiveTeeth)
  sensitiveTeeth: SensitiveTeeth;

  @IsNumber()
  @Min(0)
  saleAmount: number;

  @IsNumber()
  @Min(1000000000, { message: 'Mobile number must be exactly 10 digits' })
  @Max(9999999999, { message: 'Mobile number must be exactly 10 digits' })
  mobile: number;

  @IsString()
  @IsNotEmpty()
  villageCode: string;
}
