import { IsUrl } from 'class-validator';

export class AddImageDto {
  @IsUrl()
  image: string;
}
