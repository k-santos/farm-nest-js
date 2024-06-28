import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class FindLotDto {
  @IsIn(['NAME', 'CODE'], {
    message: 'Criteria must be either NAME or CODE',
  })
  @IsString()
  criteria: string | null;

  @IsIn(['ASC', 'DESC'], { message: 'Order must be either ASC or DESC' })
  @IsString()
  order: string | null;

  @IsNotEmpty()
  value: string;
}
