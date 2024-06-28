import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from 'src/dto/input/createAnimalDto';
import { lots } from 'src/database/seed';
import { Animal } from 'src/entities/animal';

@Injectable()
export class AnimalService {
  createAnimal(createAnimalDto: CreateAnimalDto) {
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
    return animal;
  }
}
