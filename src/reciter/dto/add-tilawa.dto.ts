import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddTilawaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name_english: string;

  @IsNumber()
  reciter_id: number;
}
