import { Exclude, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBugReportDto {
  @Exclude()
  user_id: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  android_version: number;

  @IsString()
  brand: string;

  @IsString()
  body: string;

  @IsOptional()
  image?: string;
}
