import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateLotDto {
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  code: number;
}
