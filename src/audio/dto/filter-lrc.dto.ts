import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FilterAudioLrcDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  surah_id: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  tilawa_id: number;
}
