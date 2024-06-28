import { IsNumberString, IsNotEmpty } from 'class-validator';

export class DeleteAnimalDto {
  @IsNumberString()
  @IsNotEmpty()
  code: string;
}
