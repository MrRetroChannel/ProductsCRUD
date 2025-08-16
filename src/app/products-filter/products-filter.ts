import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, skip, Subject, takeUntil } from 'rxjs';
import { Category } from '../models/category.model';
import { CategoriesService } from '../services/categories.service';

export type ProductsFilter = {
  name: string | null;
  category: Category[] | null;
  lowerPrice: number | null;
  upperPrice: number | null;
  stock: number;
  rating: number | null;
};

@Component({
  selector: 'products-filter',
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.scss',
  imports: [FormsModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule],
})
export class ProductsFilterComponent implements OnInit, OnDestroy {
  @Input()
  maxPrice: number | null = 10000;

  @Output()
  filter = new EventEmitter<ProductsFilter>();

  activeFilter: boolean = false;

  private destroy$ = new Subject<void>();
  categories: Category[] = [];

  hoveredStars: number = 0;

  nameSubject = new BehaviorSubject<string | null>(null);
  categorySubject = new BehaviorSubject<Category[] | null>(null);
  lowerPriceSubject = new BehaviorSubject<number | null>(null);
  upperPriceSubject = new BehaviorSubject<number | null>(null);
  stockSubject = new BehaviorSubject<number>(0);
  ratingSubject = new BehaviorSubject<number>(0);

  constructor(private readonly _categoriesService: CategoriesService) {}

  ngOnInit() {
    combineLatest([
      this.nameSubject,
      this.categorySubject,
      this.lowerPriceSubject,
      this.upperPriceSubject,
      this.stockSubject,
      this.ratingSubject,
    ])
      .pipe(skip(1), debounceTime(200), takeUntil(this.destroy$))
      .subscribe(([name, category, lowerPrice, upperPrice, stock, rating]) => {
        this.activeFilter = !!(name || category || lowerPrice || upperPrice || stock || rating);
        this.filter.emit({ name, category, lowerPrice, upperPrice, stock, rating });
      });

    this._categoriesService.categories.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetFilter() {
    this.nameSubject.next(null);
    this.categorySubject.next(null);
    this.lowerPriceSubject.next(null);
    this.upperPriceSubject.next(null);
    this.stockSubject.next(0);
    this.ratingSubject.next(0);
  }
}
