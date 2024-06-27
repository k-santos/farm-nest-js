import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { LotService } from './lot.service';
import { Lot } from 'src/entities/lot';
import { FindLotDto } from 'src/dto/findLotDto';

@Controller('lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Post('create')
  createLote(@Body() lot: Lot) {
    return this.lotService.createLot(lot);
  }

  @Get('find')
  async findLot(@Body(ValidationPipe) findLotDto: FindLotDto) {
    const lot = await this.lotService.findLot(findLotDto);
    if (!lot) {
      throw new NotFoundException('Lot not found');
    }
    return lot;
  }
}
