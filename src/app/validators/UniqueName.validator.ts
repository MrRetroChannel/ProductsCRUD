import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
@Injectable({
  providedIn: 'root',
})
export class UniqueNameValidator implements AsyncValidator {
  constructor(private readonly _productsService: ProductsService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return this._productsService.checkExistingName(control.value).pipe(
      take(1),
      map((exists) => (exists ? { uniqueName: true } : null))
    );
  }
}
