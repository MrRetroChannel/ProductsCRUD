import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { StarsRatingPipe, StarType } from '../pipes/stars-rating.pipe';
import { ProductsFilter, ProductsFilterComponent } from '../products-filter/products-filter';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';
import { ProductDeleteDialogComponent } from './product-delete-dialog/product-delete-dialog.component';
import {
  ProductEditData,
  ProductEditDialogComponent,
} from './product-edit-dialog/product-edit-dialog.component';

@Component({
  selector: 'products-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    ProductsFilterComponent,
    CurrencyPipe,
    StarsRatingPipe,
  ],
  templateUrl: './products-table.template.html',
  styleUrl: './products-table.styles.scss',
})
export class ProductsTable implements OnInit, OnDestroy, AfterViewInit {
  starType = StarType;

  @ViewChild('paginator') paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'category',
    'stock',
    'rating',
    'description',
    'actions',
  ];
  products: Product[] = [];
  categories: Category[] = [];

  maxPrice: number = 0;

  productsDataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();

  private destroy$ = new Subject<void>();

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _productsService: ProductsService,
    private readonly _categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this._productsService.products
      .pipe(
        tap((products) => {
          this.productsDataSource.data = products;
          this.maxPrice = Math.max(...products.map((p) => p.price), 0);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((products) => {
        this.products = products;
      });

    this._categoriesService.categories.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngAfterViewInit() {
    this.productsDataSource.paginator = this.paginator;
    this.productsDataSource.filterPredicate = (data: Product, filter: string) => {
      const parsedFilter: ProductsFilter = JSON.parse(filter);
      const { name, category, lowerPrice, upperPrice, stock, rating } = parsedFilter;

      const matchesName = !name || data.name.toLowerCase().includes(name.toLowerCase());
      const matchesCategory =
        !category || category.length === 0 || category.some((cat) => cat.id === data.category.id);
      const matchesLowerPrice = !lowerPrice || data.price >= lowerPrice;
      const matchesUpperPrice = !upperPrice || data.price <= upperPrice;
      const matchesStock = stock === 0 || (stock === 1 ? data.stock > 0 : data.stock === 0);
      const matchesRating = !rating || data.rating >= rating;

      return (
        matchesName &&
        matchesCategory &&
        matchesLowerPrice &&
        matchesUpperPrice &&
        matchesStock &&
        matchesRating
      );
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange(filter: ProductsFilter) {
    this.productsDataSource.filter = JSON.stringify(filter);
  }

  editProduct(product?: Product) {
    const dialogRef = this._dialog.open<
      ProductEditDialogComponent,
      ProductEditData,
      Product | null
    >(ProductEditDialogComponent, {
      width: '500px',
      data: { product: product, categories: this.categories },
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((result) => {
        if (product) {
          this._productsService.updateProduct(result);
        } else {
          this._productsService.addProduct(result);
        }
      });
  }

  deleteProduct(product: Product) {
    const dialogRef = this._dialog.open<ProductDeleteDialogComponent, Product, boolean>(
      ProductDeleteDialogComponent,
      {
        width: '500px',
        data: product,
        disableClose: true,
      }
    );

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this._productsService.deleteProduct(product.id);
      });
  }

  sortProducts(sort: Sort) {
    const { active, direction } = sort;
    const isAsc = direction === 'asc';

    const accessors: Record<string, (p: Product) => number | string> = {
      id: (p) => p.id,
      name: (p) => p.name,
      price: (p) => p.price,
      category: (p) => p.category.name,
      stock: (p) => p.stock,
      rating: (p) => p.rating,
    };

    const accessor = accessors[active];
    if (!accessor) return;

    this.productsDataSource.data = this.productsDataSource.data.sort((a, b) => {
      const valA = accessor(a);
      const valB = accessor(b);

      if (typeof valA === 'string' && typeof valB === 'string') {
        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return isAsc ? valA - valB : valB - valA;
      }

      return 0;
    });
  }
}
