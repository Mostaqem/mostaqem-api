import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';

export class CreateVerseDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  vers: string;

  @IsInt()
  @Min(1)
  verse_number: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3)
  vers_lang: string;

  @IsInt()
  @Min(1)
  surah_id: number;
}
