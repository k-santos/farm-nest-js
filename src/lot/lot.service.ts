import { Injectable, NotFoundException } from '@nestjs/common';
import { Lot } from 'src/entities/lot';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { FindLotDto } from 'src/dto/input/findLotDto';
import { CreateLotDto } from 'src/dto/input/createLotDto';
import { lots } from 'src/database/seed';
import { FindAllLotsDto } from 'src/dto/input/findAllLotsDto';

@Injectable()
export class LotService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async createLot(createLotDto: CreateLotDto) {
    const existsLot = lots.find(
      (lot) => lot.code === createLotDto.code || lot.name === createLotDto.name,
    );
    if (existsLot) {
      throw new NotFoundException('Lot already exists');
    }
    const lot = new Lot(createLotDto.name, createLotDto.code);
    lots.push(lot);
    await this.invalidateFindAllLotsCache();
    return lot;
  }

  async findLot(findLotDto: FindLotDto) {
    if (findLotDto.name) {
      const cachedLot = await this.redis.get(`lot:${findLotDto.name}`);
      if (cachedLot) {
        return JSON.parse(cachedLot) as Lot;
      }
      const lot = lots.find((l) => findLotDto.name === l.name);
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

      const lot = lots.find((l) => findLotDto.code === l.code);
      if (lot) {
        await this.redis.set(`lot:${findLotDto.code}`, JSON.stringify(lot));
        return lot;
      }
      return undefined;
    }
  }

  async findAllLots(findAllLotsDto: FindAllLotsDto) {
    if (!findAllLotsDto.order) {
      findAllLotsDto.order = 'ASC';
    }
    if (!findAllLotsDto.criteria) {
      findAllLotsDto.criteria = 'NAME';
    }
    const cacheKey = `lots:${findAllLotsDto.criteria}:${findAllLotsDto.order}`;
    const cachedLots = await this.redis.get(cacheKey);

    if (cachedLots) {
      return JSON.parse(cachedLots) as Lot[];
    }

    const lotsSorted = lots.sort((a, b) => {
      if (findAllLotsDto.order === 'ASC') {
        if (findAllLotsDto.criteria === 'NAME') {
          return a.name.localeCompare(b.name);
        }
        return a.code - b.code;
      } else {
        if (findAllLotsDto.criteria === 'NAME') {
          return b.name.localeCompare(a.name);
        }
        return b.code - a.code;
      }
    });

    await this.redis.set(cacheKey, JSON.stringify(lotsSorted));
    return lotsSorted;
  }

  private async invalidateFindAllLotsCache() {
    const criteria = ['NAME', 'CODE'];
    const orders = ['ASC', 'DESC'];

    for (const criterion of criteria) {
      for (const order of orders) {
        const keys = await this.redis.keys(`lots:${criterion}:${order}`);
        if (keys.length > 0) {
          await this.redis.del(keys);
        }
      }
    }
  }
}
