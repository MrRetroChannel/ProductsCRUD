import { Category } from './category.model';

export interface IProduct {
  id: number;
  name: string;
  price: number;
  category: Category;
  stock: number;
  rating: number;
  description: string;
}

export class Product implements IProduct {
  id: number;
  name: string;
  price: number;
  category: Category;
  stock: number;
  rating: number;
  description: string;

  constructor(
    id: number,
    name: string,
    price: number,
    category: Category,
    stock: number,
    rating: number,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.rating = rating;
    this.description = description;
  }
}
