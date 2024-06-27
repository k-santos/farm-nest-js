import { Injectable } from '@nestjs/common';
import { Lot } from 'src/entities/lot';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { FindLotDto } from 'src/dto/input/findLotDto';

@Injectable()
export class LotService {
  private lots: Lot[] = [];

  constructor(@InjectRedis() private readonly redis: Redis) {}

  createLot(lot: Lot) {
    this.lots.push(lot);
    return lot;
  }

  async findLot(findLotDto: FindLotDto) {
    if (findLotDto.name) {
      const cachedLot = await this.redis.get(`lot:${findLotDto.name}`);
      if (cachedLot) {
        return JSON.parse(cachedLot) as Lot;
      }
      const lot = this.lots.find((l) => findLotDto.name === l.name);
      if (lot) {
        await this.redis.set(`lot:${findLotDto.name}`, JSON.stringify(lot));
        return lot;
      }
      return undefined;
    }

    if (findLotDto.code) {
      const cachedLot = await this.redis.get(`lot:${findLotDto.code}`);
      if (cachedLot) {
        return JSON.parse(cachedLot) as Lot;
      }

      const lot = this.lots.find((l) => findLotDto.code === l.code);
      if (lot) {
        await this.redis.set(`lot:${findLotDto.code}`, JSON.stringify(lot));
        return lot;
      }
      return undefined;
    }
  }
}
