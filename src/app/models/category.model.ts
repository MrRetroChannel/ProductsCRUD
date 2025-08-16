export interface ICategory {
  id: number;
  name: string;
}

export class Category implements ICategory {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
