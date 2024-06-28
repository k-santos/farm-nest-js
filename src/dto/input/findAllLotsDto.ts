import { IsString, IsIn } from 'class-validator';

export class FindAllLotsDto {
  @IsIn(['ASC', 'DESC'], { message: 'Order must be either ASC or DESC' })
  @IsString()
  order: string | null;

  @IsIn(['NAME', 'CODE'], { message: 'Criteria must be either NAME or CODE' })
  @IsString()
  criteria: string | null;
}
