import { IsNumberString, IsNotEmpty } from 'class-validator';

export class DeleteLotDto {
  @IsNumberString()
  @IsNotEmpty()
  code: string;
}
