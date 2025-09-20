import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { paginatedRequest } from 'src/shared/paginated-request.dto';
import { ReciterCategory, ReciterRegion } from '../entities/reciter.entity';

export class ReciterFilterDto extends paginatedRequest {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(ReciterCategory)
  @IsOptional()
  category?: ReciterCategory;

  @IsEnum(ReciterRegion)
  @IsOptional()
  region?: ReciterRegion;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  is_featured?: boolean;
}
