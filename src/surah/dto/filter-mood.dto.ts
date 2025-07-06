import { IsEnum } from 'class-validator';
import { Mood } from '../enums/mood.enum';

export class FilterMoodDto {
  @IsEnum(Mood)
  mood: Mood;
}
