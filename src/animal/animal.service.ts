import { Injectable, NotFoundException } from '@nestjs/common';
import { lots } from '../database/seed';
import { Animal } from '../entities/animal';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { OutputFindAnimalDto } from '../dto/output/resultFindAnimalDto';
import { CreateAnimalDto } from '../dto/input/animal/createAnimalDto';
import { DeleteAnimalDto } from '../dto/input/animal/deleteAnimalDto';
import { FindAnimalDto } from '../dto/input/animal/findAnimalDto';
import { clearCache } from '../util/redis';

@Injectable()
export class AnimalService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async createAnimal(createAnimalDto: CreateAnimalDto) {
    const foundLot = lots.find((lot) => lot.code === createAnimalDto.lot);
    if (!foundLot) {
      throw new NotFoundException('Lot not found');
    }
    const animals = lots.map((lot) => lot.animals).flat();
    const foundAnimal = animals.find(
      (animal) => animal.code == createAnimalDto.code,
    );
    if (foundAnimal) {
      throw new NotFoundException('Animal already exists');
    }
    const animal = new Animal(createAnimalDto.name, createAnimalDto.code);
    foundLot.addAnimal(animal);
    await clearCache(this.redis);
    return animal;
  }

  async deleteAnimal(deleteAnimalDto: DeleteAnimalDto) {
    const lot = lots.find((lot) =>
      lot.animals.find(
        (animal) => animal.code === (deleteAnimalDto.code as unknown as number),
      ),
    );
    if (lot) {
      lot.removeAnimal(deleteAnimalDto.code as unknown as number);
      await clearCache(this.redis);
      return { message: 'Animal deleted successfully' };
    }
    throw new NotFoundException('Animal not found');
  }

  async findAnimals(findAnimalDto: FindAnimalDto) {
    if (!findAnimalDto.criteria) {
      findAnimalDto.criteria = 'NAME';
    }

    if (!findAnimalDto.order) {
      findAnimalDto.order = 'ASC';
    }

    const cacheKey = `animals:${findAnimalDto.criteria}:${findAnimalDto.value}:${findAnimalDto.order}`;
    const cachedAnimals = await this.redis.get(cacheKey);

    if (cachedAnimals) {
      return JSON.parse(cachedAnimals);
    }

    let animals;
    if (findAnimalDto.criteria === 'NAME') {
      animals = this.findAnimalsByName(
        findAnimalDto.value,
        findAnimalDto.order,
      );
    } else if (findAnimalDto.criteria === 'LOT_NAME') {
      animals = this.findAnimalsByLotName(
        findAnimalDto.value,
        findAnimalDto.order,
      );
    } else if (findAnimalDto.criteria === 'CODE') {
      animals = this.findAnimalByCode(findAnimalDto.value);
    } else if (findAnimalDto.criteria === 'LOT_CODE') {
      animals = this.findAnimalsByLotCode(findAnimalDto.value);
    }

    if (animals) {
      await this.redis.set(cacheKey, JSON.stringify(animals), 'EX', 7600);
      return animals;
    }
    return undefined;
  }

  private findAnimalsByName(name: string, order: string) {
    const result: OutputFindAnimalDto[] = lots
      .map((lot) => {
        const animals = lot.animals.filter((animal) =>
          animal.name.includes(name),
        );
        return animals.map((animal) => {
          return {
            lotName: lot.name,
            lotCode: lot.code,
            name: animal.name,
            code: animal.code,
          };
        });
      })
      .flat();

    const resultSorted = result.sort((a, b) => {
      if (order === 'ASC') {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

    return resultSorted;
  }

  private findAnimalsByLotName(lotName: string, order: string) {
    const result: OutputFindAnimalDto[] = lots
      .filter((lot) => lot.name.includes(lotName))
      .map((lot) => {
        return lot.animals.map((animal) => {
          return {
            lotName: lot.name,
            lotCode: lot.code,
            name: animal.name,
            code: animal.code,
          };
        });
      })
      .flat();

    const resultSorted = result.sort((a, b) => {
      if (order === 'ASC') {
        return a.lotName.localeCompare(b.lotName);
      }
      return b.lotName.localeCompare(a.lotName);
    });

    return resultSorted;
  }

  private findAnimalByCode(code: string) {
    const result = lots.find((lot) =>
      lot.animals.find((animal) => animal.code === (code as unknown as number)),
    );
    if (result) {
      const animal = result.animals.find(
        (animal) => animal.code === (code as unknown as number),
      );
      return {
        lotName: result.name,
        lotCode: result.code,
        name: animal.name,
        code: animal.code,
      };
    }
  }

  private findAnimalsByLotCode(lotCode: string) {
    const result = lots.find(
      (lot) => lot.code === (lotCode as unknown as number),
    );
    if (result) {
      return result.animals
        .map((animal) => {
          return {
            lotName: result.name,
            lotCode: result.code,
            name: animal.name,
            code: animal.code,
          };
        })
        .flat();
    }
  }
}
