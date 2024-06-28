import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { LotService } from './lot.service';
import { CreateLotDto } from 'src/dto/input/lot/createLotDto';
import { FindLotDto } from 'src/dto/input/lot/findLotDto';
import { FindAllLotsDto } from 'src/dto/input/lot/findAllLotsDto';
import { DeleteLotDto } from 'src/dto/input/lot/deleteLotDto';

@Controller('lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  @Post('create')
  async createLote(@Body(ValidationPipe) createLotDto: CreateLotDto) {
    return await this.lotService.createLot(createLotDto);
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

  @Delete()
  async deleteLot(@Body(ValidationPipe) deleteLotDto: DeleteLotDto) {
    return await this.lotService.deleteLot(deleteLotDto);
  }
}
