export class Animal {
  private _name: string;
  private _code: number;

  constructor(name: string, code: number) {
    this._name = name;
    this._code = code;
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
}
