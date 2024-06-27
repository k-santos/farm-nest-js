import { Injectable } from '@nestjs/common';
import { Lot } from 'src/entities/lot';

@Injectable()
export class LotService {
  private lots: Lot[] = [];

  createLot(lot: Lot) {
    this.lots.push(lot);
    return lot;
  }
}
