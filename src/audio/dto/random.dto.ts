import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsTimeZone } from 'class-validator';

export class RandomDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  reciter_id?: number;

  @IsOptional()
  @IsTimeZone()
  timeZone?: string;
}
