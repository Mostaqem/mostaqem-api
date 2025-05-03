import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  Min,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateSurahDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name_arabic: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name_complex: string;

  @IsInt()
  @Min(1)
  verses_count: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  revelation_place: string;

  @IsString()
  @MaxLength(250)
  @IsUrl()
  @IsOptional()
  image?: string;
}
