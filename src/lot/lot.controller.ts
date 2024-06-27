import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { LotService } from './lot.service';
import { Lot } from 'src/entities/lot';

@Controller('lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Post('create')
  createLote(@Body() lot: Lot) {
    return this.lotService.createLot(lot);
  }
}
