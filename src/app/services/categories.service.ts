import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _categories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([
    { id: 1, name: 'Электроника' },
    { id: 2, name: 'Бытовая техника' },
    { id: 3, name: 'Одежда' },
  ]);

  private _categories$: Observable<Category[]> = this._categories.asObservable();

  get categories(): Observable<Category[]> {
    return this._categories$;
  }
}
