import { Animal } from '../entities/animal';
import { Lot } from '../entities/lot';

export const lots: Lot[] = [];

export function seedData(data: any[]) {
  for (const lotData of data) {
    const lot = new Lot(lotData.name, lotData.code);
    for (const animalData of lotData.animals) {
      const animal = new Animal(animalData.name, animalData.code);
      lot.addAnimal(animal);
    }
    lots.push(lot);
  }
  return lots;
}
