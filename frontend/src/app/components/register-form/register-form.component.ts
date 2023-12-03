import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  faTrashCan,
  faPencil,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../app/service/product.service';
import { ProductData, ProductPriceData } from '../../../app/interfaces/product';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { SellPriceDialogComponent } from '../sell-price-dialog/sell-price-dialog.component';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements AfterViewInit {
  faTrashCan = faTrashCan;
  faPencil = faPencil;
  faPlusCircle = faPlusCircle;

  @Input() productId!: string | null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  displayedColumns: string[] = ['addprice', 'store', 'sellprice', 'action'];
  dataSource!: MatTableDataSource<ProductPriceData>;
  product!: ProductData | null;

  action: number = 1; //define que será uma criação

  inputId!: number;
  inputDesc: string = '';
  inputPrice: string = '';
  selectedFile: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngOnInit() {
    if (this.productId != null) {
      try {
        const products = await this.productService.getProductsById(
          this.productId
        );
        if (products != null) {
          this.inputId = products.id;
          this.inputDesc = products.desc;
          this.inputPrice = parseFloat(products.price).toFixed(2);
          this.url =
            'data:image/jpeg;base64,' +
            this.bytesBufferToBase64(products.image);

          this.action = 2; //define que será uma atualização
        } else {
          this.router.navigate(['/cadastro']);
        }
      } catch (error) {
        this.router.navigate(['/cadastro']);
      }
    }
    const products = await this.productService.getProductsSellPrice(
      this.productId
    );
    this.dataSource = new MatTableDataSource(products);

    this.dataSource.paginator = this.paginator;
  }

  bytesBufferToBase64(buffer: any) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  ngAfterViewInit() {
    try {
      this.paginator.pageSize = 2;
      this.dataSource.paginator = this.paginator;
    } catch (error) {}
  }

  url: string = '';

  onSelectFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(inputElement.files[0]);
      reader.onload = (eventLoad: any) => {
        this.url = eventLoad.target.result;
        this.selectedFile = this.url.split(',')[1];
      };
    }
  }

  async saveProduct() {
    if (this.inputPrice == '') {
      this.inputPrice = '0';
    }

    if (!this.isValidDesc(this.inputDesc)) {
      this.toastr.error(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        'Descrição invalida'
      );
    } else if (
      !this.isValidPrice(parseFloat(this.inputPrice)) ||
      isNaN(parseFloat(this.inputPrice))
    ) {
      this.toastr.error(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        'Custo invalido'
      );
    } else {
      if (this.action == 1) {
        const result = await this.productService.addProduct({
          desc: this.inputDesc,
          price: this.inputPrice,
          image: this.selectedFile,
        });
        if (result != undefined) {
          const productId = result.id;
          this.router.navigate(['/cadastro', productId]);
        } else {
          this.toastr.error(
            'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
            'Erro ao cadastrar produto'
          );
        }
      } else if (this.action == 2) {
        if (this.inputId != undefined) {
          const result = await this.productService.updateProduct(this.inputId, {
            desc: this.inputDesc,
            price: this.inputPrice,
            image: this.selectedFile,
          });
          if (result == null) {
            this.toastr.success('Atualizado com sucesso', 'Sucesso');
          }
        }
      } else {
        console.log('Erro, não foi possivel identificar a ação desejada!');
      }
    }
  }

  deleteProduct(productId: number): void {
    if (confirm(`Deseja mesmo excluir este preço?`)) {
      this.productService.deleteProductLoja(productId).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          console.error('Erro ao excluir preço de venda:', error);
        }
      );
    }
  }

  openDialog(idSellPrice: number | null) {
    let dialogRef = this.dialog.open(SellPriceDialogComponent, {
      data: { idProd: this.inputId, idSellPrice: idSellPrice },
    });
    dialogRef.afterClosed().subscribe((result) => {
      window.location.reload();
    });
  }

  /**
   * Verifica se a Descricao informado não esta vazia e possui no maximo 60 caracteres
   * @param descValue descricao informada
   * @returns booleano informando se esta valido
   */
  isValidDesc(descValue: string): boolean {
    if (!descValue) {
      return false;
    }

    return (
      descValue.trim() !== '' && descValue.length > 0 && descValue.length <= 60
    );
  }

  /**
   * Verifica se o preço informado esta valido
   * @param priceValue preço definido
   * @returns booleano informando se esta valido
   */
  isValidPrice(priceValue: number): boolean {
    if (priceValue == undefined) {
      return false;
    }
    const stringValue = priceValue.toString();
    const [integerPart, decimalPart] = stringValue.split('.');

    if (integerPart.length > 10) {
      return false;
    }

    if (decimalPart && decimalPart.length > 3) {
      return false;
    }

    return true;
  }
}
