import { Injectable, NotFoundException } from '@nestjs/common';
import { lots } from 'src/database/seed';
import { Animal } from 'src/entities/animal';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { OutputFindAnimalDto } from 'src/dto/output/resultFindAnimalDto';
import { CreateAnimalDto } from 'src/dto/input/animal/createAnimalDto';
import { DeleteAnimalDto } from 'src/dto/input/animal/deleteAnimalDto';
import { FindAnimalDto } from 'src/dto/input/animal/findAnimalDto';

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
    await this.clearCache();
    return animal;
  }

  async deleteAnimal(deleteAnimalDto: DeleteAnimalDto) {
    const lot = lots.find((lot) =>
      lot.animals.find(
        (animal) => animal.code === (deleteAnimalDto.code as unknown as number),
      ),
    );
    if (lot) {
      const animal = lot.animals.find(
        (animal) => animal.code === (deleteAnimalDto.code as unknown as number),
      );
      lot.removeAnimal(animal.code);
      await this.clearCache();
      return animal;
    }
    return undefined;
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
      await this.redis.set(cacheKey, JSON.stringify(animals));
      return animals;
    }
    return undefined;
  }

  async clearCache() {
    let keys = await this.redis.keys('animals:*');
    if (keys.length > 0) {
      await this.redis.del(keys);
    }

    keys = await this.redis.keys('lots:*');
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
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
