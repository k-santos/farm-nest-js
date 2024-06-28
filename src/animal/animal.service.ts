import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';
import { lots } from 'src/database/seed';
import { Animal } from 'src/entities/animal';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

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
