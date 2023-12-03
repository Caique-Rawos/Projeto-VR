import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../../app/service/product.service';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ProductData } from '../../../app/interfaces/product';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
})
export class ProductsTableComponent implements AfterViewInit {
  faTrashCan = faTrashCan;
  faPencil = faPencil;

  displayedColumns: string[] = ['id', 'desc', 'price', 'action'];
  dataSource!: MatTableDataSource<ProductData>;

  filtroId: string = '';
  filtroDesc: string = '';
  filtroPrice: string = '';
  filtroSell: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private productService: ProductService) {}

  async ngOnInit() {
    const products = await this.productService.getProductsDataTable(
      '',
      '',
      '',
      ''
    );
    this.dataSource = new MatTableDataSource(products);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {}
  }

  async applyFilter() {
    if (!this.filtroId) {
      this.filtroId = '';
    }
    if (!this.filtroDesc) {
      this.filtroDesc = '';
    }
    if (!this.filtroPrice) {
      this.filtroPrice = '';
    }
    if (!this.filtroSell) {
      this.filtroSell = '';
    }
    const products = await this.productService.getProductsDataTable(
      this.filtroId,
      this.filtroDesc,
      this.filtroPrice,
      this.filtroSell
    );
    this.dataSource.data = products;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(productId: number): void {
    if (confirm(`Deseja mesmo excluir o produto de codigo ${productId}?`)) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          console.error('Erro ao excluir produto:', error);
        }
      );
    }
  }

  editarProduct(productId: number) {
    this.router.navigate(['/cadastro', productId]);
  }
}
