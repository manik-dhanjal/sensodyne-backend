import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SensitivitySurveyService } from './sensitivity-survey.service';
import { SensitivitySurvey } from './sensitivity-survey.schema';
import { AuthGuard } from '../gaurds/auth.gaurd';
import { UseRoles } from 'src/decorators/use-role.decorator';
import { Role } from 'src/user/enum/role.enum';
import { CreateSensitivitySurveyDto } from './dto/create-sensitivity-survey.dto';

@Controller('sensitivity-survey')
export class SensitivitySurveyController {
  constructor(private readonly surveyService: SensitivitySurveyService) {}

  // Create a new survey (authenticated)
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateSensitivitySurveyDto, @Req() req) {
    // Attach userId from authenticated user
    const survey = await this.surveyService.create({
      ...data,
      userId: req.user._id,
    });
    return survey;
  }

  // Get all surveys for a specific user
  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.surveyService.findByUserId(userId);
  }

  // Get all surveys (admin or for reporting)
  @UseGuards(AuthGuard)
  @UseRoles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.surveyService.findAll();
  }

  // Get a survey by its id
  @UseGuards(AuthGuard)
  @UseRoles(Role.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.surveyService.findById(id);
  }

  // Update a survey by id
  @UseGuards(AuthGuard)
  @UseRoles(Role.ADMIN)
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() update: Partial<SensitivitySurvey>,
  ) {
    return this.surveyService.updateById(id, update);
  }

  // Delete a survey by id
  @UseGuards(AuthGuard)
  @UseRoles(Role.ADMIN)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.surveyService.deleteById(id);
  }
}
