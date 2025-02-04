import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class RandomDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  reciter_id: number;
}
