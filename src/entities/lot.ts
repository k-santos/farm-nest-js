import { Animal } from './animal';

export class Lot {
  private _name: string;
  private _code: number;
  private _animals: Animal[];

  constructor(name: string, code: number) {
    this._name = name;
    this._code = code;
    this.animals = [];
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get code(): number {
    return this._code;
  }

  set code(value: number) {
    this._code = value;
  }

  addAnimal(animal: Animal) {
    this._animals.push(animal);
  }

  removeAnimal(code: number): boolean {
    const index = this._animals.findIndex((animal) => animal.code === code);
    if (index !== -1) {
      this._animals.splice(index, 1);
      return true;
    }
    return false;
  }

  get animals(): Animal[] {
    return this._animals;
  }

  set animals(value: Animal[]) {
    this._animals = value;
  }
}
