import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { LotService } from './lot.service';
import { FindLotDto } from 'src/dto/input/findLotDto';
import { CreateLotDto } from 'src/dto/input/createLotDto';
import { FindAllLotsDto } from 'src/dto/input/findAllLotsDto';

@Controller('lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Post('create')
  createLote(@Body(ValidationPipe) createLotDto: CreateLotDto) {
    return this.lotService.createLot(createLotDto);
  }

  @Get('find')
  async findLot(@Body(ValidationPipe) findLotDto: FindLotDto) {
    const lot = await this.lotService.findLot(findLotDto);
    if (!lot) {
      throw new NotFoundException('Lot not found');
    }
    return lot;
  }

  @Get('findAll')
  async findAllLots(@Body(ValidationPipe) findAllLotsDto: FindAllLotsDto) {
    return await this.lotService.findAllLots(findAllLotsDto);
  }
}
