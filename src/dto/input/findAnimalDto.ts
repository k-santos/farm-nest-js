import { IsNumberString, IsIn, IsString } from 'class-validator';

export class FindAnimalDto {
  @IsIn(['ASC', 'DESC'], { message: 'Order must be either ASC or DESC' })
  @IsString()
  order: string | null;

  @IsIn(['NAME', 'CODE', 'LOT_NAME', 'LOT_CODE'], {
    message: 'Criteria must be either NAME, CODE, LOT_NAME OR LOT_CODE',
  })
  @IsString()
  criteria: string | null;

  @IsString()
  value: string;
}
