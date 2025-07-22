import { IsNumber } from 'class-validator';

export class UserPreferencesDto {
  @IsNumber()
  default_reciter_id: number;

  @IsNumber()
  default_tilawa: number;
}
