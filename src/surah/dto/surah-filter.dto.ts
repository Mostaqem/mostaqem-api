import { IsOptional, IsString } from 'class-validator';
import { paginatedRequest } from 'src/shared/paginated-request.dto';

export class SurahFilterDto extends paginatedRequest {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;
}
