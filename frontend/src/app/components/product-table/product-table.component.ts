import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  ProductTableDataSource,
  ProductTableItem,
} from './product-table-datasource';
import { ProductService } from 'src/app/service/product.service';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;

  faTrashCan = faTrashCan;
  faPencil = faPencil;

  constructor(private productService: ProductService) {}

  dataSource = new ProductTableDataSource(this.productService);

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'desc', 'price', 'action'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  deleteProduct(productId: number): void {
    if (confirm('Deseja mesmo excluir este produto?')) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          window.location.reload();
          // Atualize sua lista de produtos ou realize outras ações necessárias após a exclusão.
        },
        (error) => {
          console.error('Erro ao excluir produto:', error);
        }
      );
    }
  }
}
