import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, fromEvent, map, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { CategoriesService } from './categories.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly STORAGE_KEY = 'products';
  private productsSubject = new BehaviorSubject<Product[]>(this.loadFromStorage());
  private categories: Category[] = [];

  private _products$ = this.productsSubject.asObservable();
  get products(): Observable<Product[]> {
    return this._products$;
  }

  constructor(private readonly _categoriesService: CategoriesService) {
    this._categoriesService.categories.subscribe((categories) => {
      this.categories = categories;
      if (this.productsSubject.value.length === 0) {
        const initialProducts = this.getInitialProducts();
        this.updateProducts(initialProducts);
      }
    });

    fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        map((event) => (event.key === this.STORAGE_KEY ? this.loadFromStorage() : null)),
        filter(Boolean)
      )
      .subscribe((products) => {
        this.productsSubject.next(products);
      });
  }

  addProduct(product: Product) {
    const updatedProducts = [...this.productsSubject.value, { ...product, id: this.generateId() }];
    this.updateProducts(updatedProducts);
  }

  updateProduct(updatedProduct: Product) {
    const updatedProducts = this.productsSubject.value.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    this.updateProducts(updatedProducts);
  }

  deleteProduct(productId: number) {
    const updatedProducts = this.productsSubject.value.filter((p) => p.id !== productId);
    this.updateProducts(updatedProducts);
  }

  checkExistingName(name: string): Observable<boolean> {
    return this.products.pipe(map((products) => products.some((product) => product.name === name)));
  }

  private updateProducts(products: Product[]) {
    this.productsSubject.next(products);
    this.saveToStorage(products);
  }

  private loadFromStorage(): Product[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }

  private generateId(): number {
    const products = this.productsSubject.value;
    return products.length > 0 ? products[products.length - 1].id + 1 : 1;
  }

  private getInitialProducts(): Product[] {
    const electronicsCategory = this.categories[0];
    const appliancesCategory = this.categories[1];
    const clothingCategory = this.categories[2];

    return [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 89990,
        category: electronicsCategory,
        stock: 0,
        rating: 4.8,
        description: 'Смартфон Apple',
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24',
        price: 74990,
        category: electronicsCategory,
        stock: 30,
        rating: 4.7,
        description: 'Android-смартфон',
      },
      {
        id: 3,
        name: 'MacBook Air M2',
        price: 124990,
        category: electronicsCategory,
        stock: 15,
        rating: 4.9,
        description: 'Ноутбук от Apple',
      },
      {
        id: 4,
        name: 'Sony WH-1000XM5',
        price: 24990,
        category: electronicsCategory,
        stock: 40,
        rating: 4.6,
        description: 'Беспроводные наушники',
      },
      {
        id: 5,
        name: 'Dyson V15 Detect',
        price: 54990,
        category: appliancesCategory,
        stock: 20,
        rating: 4.7,
        description: 'Беспроводной пылесос',
      },
      {
        id: 6,
        name: 'Philips Airfryer XXL',
        price: 18990,
        category: appliancesCategory,
        stock: 35,
        rating: 4.5,
        description: '',
      },
      {
        id: 7,
        name: 'LG InstaView Door-in-Door',
        price: 89990,
        category: appliancesCategory,
        stock: 8,
        rating: 4.4,
        description: 'Холодильник',
      },
      {
        id: 8,
        name: 'Bosch Serie 6 WAU28T90BY',
        price: 45990,
        category: appliancesCategory,
        stock: 12,
        rating: 4.3,
        description: 'Стиральная машина',
      },
      {
        id: 9,
        name: 'Nike Air Max 270',
        price: 12990,
        category: clothingCategory,
        stock: 50,
        rating: 4.4,
        description: 'Кроссовк',
      },
      {
        id: 10,
        name: "Levi's 501 Original",
        price: 7990,
        category: clothingCategory,
        stock: 75,
        rating: 4.6,
        description: 'Классические джинсы',
      },
      {
        id: 11,
        name: 'Uniqlo Heattech',
        price: 1990,
        category: clothingCategory,
        stock: 100,
        rating: 4.2,
        description: 'Термобелье',
      },
      {
        id: 12,
        name: 'Zara Wool Coat',
        price: 8990,
        category: clothingCategory,
        stock: 25,
        rating: 4.3,
        description: 'Шерстяное пальто',
      },
    ];
  }
}
