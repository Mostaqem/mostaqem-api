import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateReciterDto {
  id: number;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name_english: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  name_arabic: string;

  @IsUrl()
  @IsOptional()
  image: string;
}
