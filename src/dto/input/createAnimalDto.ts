import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateAnimalDto {
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  code: number;

  @IsNumberString()
  lot: number;
}
