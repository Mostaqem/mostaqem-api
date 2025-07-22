import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
