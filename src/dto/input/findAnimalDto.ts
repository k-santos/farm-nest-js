import { IsNumberString, IsIn, IsString } from 'class-validator';

export class FindAnimalDto {
  @IsIn(['ASC', 'DESC'], { message: 'Order must be either ASC or DESC' })
  @IsString()
  order: string | null;

  @IsIn(['NAME', 'CODE', 'LOTE_NAME', 'LOTE_CODE'], {
    message: 'Criteria must be either NAME, CODE, LOTE_NAME OR LOTE_CODE',
  })
  @IsString()
  criteria: string | null;

  @IsString()
  value: string;
}
