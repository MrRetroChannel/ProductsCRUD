import { Component } from '@angular/core';
import { ProductsTable } from './products-table/products-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [ProductsTable],
})
export class App {}
