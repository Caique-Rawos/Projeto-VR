import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge, from } from 'rxjs';
import { ProductService } from 'src/app/service/product.service';

// TODO: Replace this with your own data model type
export interface ProductTableItem {
  id: number;
  desc: string;
  price: number;
}


/**
 * Data source for the ProductTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable({
  providedIn: 'root',
})
export class ProductTableDataSource extends DataSource<ProductTableItem> {
  data: ProductTableItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private productService: ProductService) {
    super();
  }

  connect(): Observable<ProductTableItem[]> {
    if (this.paginator && this.sort) {
      return merge(
        from(this.productService.getProducts()), // Converte a Promise para Observable
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        switchMap(() => {
          // Agora, após a resolução da Promise, atribuímos os dados a `data`
          return this.productService.getProducts().then((data) => {
            this.data = data;
            return this.getPagedData(this.getSortedData([...this.data]));
          });
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  disconnect(): void {}

  private getPagedData(data: ProductTableItem[]): ProductTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.slice(startIndex, startIndex + this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: ProductTableItem[]): ProductTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'desc':
          return compare(a.desc, b.desc, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        case 'price':
          return compare(+a.price, +b.price, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
