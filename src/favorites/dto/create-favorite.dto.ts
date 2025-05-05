import { Exclude } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsNumber()
  tilawa_id: number;

  @IsNumber()
  surah_id: number;

  @Exclude()
  user_id: string;
}
