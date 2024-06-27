import { Animal } from 'src/entities/animal';
import { Lot } from 'src/entities/lot';

export const lots: Lot[] = [];
export const animals: Animal[] = [];

export function seedData(data: any[]) {
  for (const lotData of data) {
    const lot = new Lot(lotData.name, lotData.code);
    for (const animalData of lotData.animals) {
      const animal = new Animal(animalData.name, animalData.code);
      animals.push(animal);
      lot.addAnimal(animal);
    }
    lots.push(lot);
  }
  return lots;
}
