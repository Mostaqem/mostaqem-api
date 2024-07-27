import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterAudioDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  surah_id: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  reciter_id: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  tilawa_id?: number;
}
