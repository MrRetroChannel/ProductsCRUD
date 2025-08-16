import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { UniqueNameValidator } from '../../validators/UniqueName.validator';

export type ProductEditData = {
  product?: Product;
  categories: Category[];
};

@Component({
  selector: 'product-edit-dialog',
  templateUrl: './product-edit-dialog.template.html',
  styleUrl: './product-edit-dialog.style.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class ProductEditDialogComponent {
  form: FormGroup<{
    name: FormControl<string>;
    price: FormControl<number | null>;
    category: FormControl<Category | null>;
    stock: FormControl<number | null>;
    description: FormControl<string>;
  }>;

  constructor(
    public dialogRef: MatDialogRef<ProductEditDialogComponent, Product>,
    @Inject(MAT_DIALOG_DATA) public data: ProductEditData,
    private readonly _fb: FormBuilder,
    nameValidator: UniqueNameValidator
  ) {
    this.form = this._fb.nonNullable.group({
      name: [
        data.product?.name || '',
        [Validators.required],
        data.product?.id ? [] : [nameValidator.validate.bind(nameValidator)],
      ],
      price: [data.product?.price || null, [Validators.required, Validators.min(0.01)]],
      category: [data.product?.category || null, [Validators.required]],
      stock: [data.product?.stock || null, [Validators.pattern('^[0-9]*$')]],
      description: data.product?.description || '',
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      this.dialogRef.close({
        id: this.data.product?.id || 0,
        name: formValue.name!,
        price: formValue.price!,
        description: formValue.description!,
        category: formValue.category!,
        stock: formValue.stock || 0,
        rating: this.data.product?.rating || 0,
      });
    }
  }

  categoryCompareFn(c1: Category, c2: Category): boolean {
    return c1?.id === c2?.id;
  }
}
