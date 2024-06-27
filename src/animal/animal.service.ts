import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';
import { animals, lots } from 'src/database/seed';
import { Animal } from 'src/entities/animal';

@Injectable()
export class AnimalService {
  createAnimal(createAnimalDto: CreateAnimalDto) {
    const foundLot = lots.find((lot) => lot.code === createAnimalDto.lot);
    if (!foundLot) {
      throw new NotFoundException('Lot not found');
    }
    const foundAnimal = animals.find(
      (animal) => animal.code === createAnimalDto.code,
    );
    if (foundAnimal) {
      throw new NotFoundException('Animal already exists');
    }
    const animal = new Animal(createAnimalDto.name, createAnimalDto.code);
    foundLot.addAnimal(animal);
    animals.push(animal);
    return animal;
  }
}
