import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lot } from '../entities/lot';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { lots } from '../database/seed';
import { CreateLotDto } from '../dto/input/lot/createLotDto';
import { FindLotDto } from '../dto/input/lot/findLotDto';
import { DeleteLotDto } from '../dto/input/lot/deleteLotDto';
import { clearCache } from '../util/redis';

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
    await clearCache(this.redis);
    return lot;
  }

  async findLot(findLotDto: FindLotDto) {
    if (findLotDto.criteria === 'NAME') {
      const cachedLot = await this.redis.get(
        `lots:${findLotDto.criteria}:${findLotDto.order}:${findLotDto.value}`,
      );
      if (cachedLot) {
        return JSON.parse(cachedLot) as Lot[];
      }
      const foundLots = lots.filter((l) => l.name.includes(findLotDto.value));
      if (foundLots) {
        const lotsSorted = foundLots.sort((a, b) => {
          if (findLotDto.order === 'ASC') {
            return a.name.localeCompare(b.name);
          }
          return b.name.localeCompare(a.name);
        });

        await this.redis.set(
          `lots:${findLotDto.criteria}:${findLotDto.order}:${findLotDto.value}`,
          JSON.stringify(lotsSorted),
          'EX',
          7600,
        );
        return lotsSorted;
      }
      throw new NotFoundException('Lot not found');
    }

    if (findLotDto.criteria === 'CODE') {
      const cachedLot = await this.redis.get(
        `lots:${findLotDto.criteria}:${findLotDto.order}:${findLotDto.value}`,
      );
      if (cachedLot) {
        return JSON.parse(cachedLot) as Lot;
      }

      const lot = lots.find(
        (l) => (findLotDto.value as unknown as number) === l.code,
      );
      if (lot) {
        await this.redis.set(
          `lots:${findLotDto.criteria}:${findLotDto.order}:${findLotDto.value}`,
          JSON.stringify(lot),
          'EX',
          7600,
        );
        return lot;
      }
      throw new NotFoundException('Lot not found');
    }
  }

  async deleteLot(deleteLotDto: DeleteLotDto) {
    const lotIndex = lots.findIndex(
      (lot) => lot.code === (deleteLotDto.code as unknown as number),
    );
    if (lotIndex === -1) {
      throw new NotFoundException('Lot not found');
    }

    const lot = lots[lotIndex];
    if (lot.animals.length > 0) {
      throw new BadRequestException('Cannot delete lot with animals');
    }

    lots.splice(lotIndex, 1);
    await clearCache(this.redis);
    return { message: 'Lot deleted successfully' };
  }
}
