import { Injectable } from '@nestjs/common';
import { Lot } from 'src/entities/lot';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class LotService {
  private lots: Lot[] = [];

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  createLot(lot: Lot) {
    this.lots.push(lot);
    return lot;
  }

  async findLot(code: string) {
    const cachedLot = await this.redisClient.get(`lot:${code}`);
    if (cachedLot) {
      return JSON.parse(cachedLot) as Lot;
    }
    const lot = this.lots.find((l) => l.code === code);
    if (lot) {
      await this.redisClient.set(`lot:${code}`, JSON.stringify(lot));
    }

    return lot;
  }
}
