import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lot } from 'src/entities/lot';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { lots } from 'src/database/seed';
import { CreateLotDto } from 'src/dto/input/lot/createLotDto';
import { FindLotDto } from 'src/dto/input/lot/findLotDto';
import { FindAllLotsDto } from 'src/dto/input/lot/findAllLotsDto';
import { DeleteLotDto } from 'src/dto/input/lot/deleteLotDto';
import { clearCache } from 'src/util/redis';

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

  async deleteLot(deleteLotDto: DeleteLotDto) {
    console.log(deleteLotDto.code);
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
}
