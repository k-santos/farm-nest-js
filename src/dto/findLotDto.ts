import { IsNotEmpty, ValidateIf, IsNumberString } from 'class-validator';

export class FindLotDto {
  @ValidateIf((obj: FindLotDto) => !obj.code && !obj.name)
  @IsNotEmpty({ message: 'Name or code should be provided' })
  name: string | null;

  @IsNumberString()
  code: number | null;
}
