import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';
import { lots } from 'src/database/seed';
import { Animal } from 'src/entities/animal';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { FindAnimalDto } from 'src/dto/input/findAnimalDto';
import { OutputFindAnimalDto } from 'src/dto/output/resultFindAnimalDto';

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
    await this.invalidateFindAllLotsCache();
    return animal;
  }

  async findAnimals(findAnimalDto: FindAnimalDto) {
    if (!findAnimalDto.criteria) {
      findAnimalDto.criteria = 'NAME';
    }

    if (!findAnimalDto.order) {
      findAnimalDto.order = 'ASC';
    }

    if (findAnimalDto.criteria === 'NAME') {
      const result: OutputFindAnimalDto[] = lots
        .map((lot) => {
          const animals = lot.animals.filter((animal) =>
            animal.name.includes(findAnimalDto.value),
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
        if (findAnimalDto.order === 'ASC') {
          return a.name.localeCompare(b.name);
        }
        return b.name.localeCompare(a.name);
      });

      return resultSorted;
    }

    if (findAnimalDto.criteria === 'LOT_NAME') {
      const result: OutputFindAnimalDto[] = lots
        .filter((lot) => lot.name.includes(findAnimalDto.value))
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
        if (findAnimalDto.order === 'ASC') {
          return a.lotName.localeCompare(b.lotName);
        }
        return b.lotName.localeCompare(a.lotName);
      });

      return resultSorted;
    }
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
