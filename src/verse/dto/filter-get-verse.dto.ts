import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { paginatedRequest } from 'src/shared/paginated-request.dto';

export class GetVerseFilterDto extends paginatedRequest {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  surah_id?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
