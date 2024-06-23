import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetVerseFilterDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  surah_id: number;
}
