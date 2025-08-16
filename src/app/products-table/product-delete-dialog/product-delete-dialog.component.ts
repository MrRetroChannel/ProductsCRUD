import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../models/product.model';

@Component({
  selector: 'product-delete-dialog',
  templateUrl: './product-delete-dialog.template.html',
  styleUrl: './product-delete-dialog.style.scss',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class ProductDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDeleteDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}
}
