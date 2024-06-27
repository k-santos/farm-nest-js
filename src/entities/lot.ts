export class Lot {
  private _name: string;
  private _code: string;

  constructor(name: string, code: string) {
    this._name = name;
    this._code = code;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get code(): string {
    return this._code;
  }

  set code(value: string) {
    this._code = value;
  }
}
