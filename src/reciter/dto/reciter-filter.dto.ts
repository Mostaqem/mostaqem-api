import { IsOptional, IsString } from 'class-validator';
import { paginatedRequest } from 'src/shared/paginated-request.dto';

export class ReciterFilterDto extends paginatedRequest {
  @IsString()
  @IsOptional()
  name: string;
}
