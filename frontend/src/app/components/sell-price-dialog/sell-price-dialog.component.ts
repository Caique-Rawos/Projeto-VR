import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';
import { StoreData } from 'src/app/interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sell-price-dialog',
  templateUrl: './sell-price-dialog.component.html',
  styleUrls: ['./sell-price-dialog.component.scss'],
})
export class SellPriceDialogComponent implements AfterViewInit {
  faFloppyDisk = faFloppyDisk;
  faXmark = faXmark;

  titleDialog: string = 'Inclusão';

  action: number = 1; //define que será uma criação
  inputSellPrice: string = '';
  selectIdStore!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  storeControl = new FormControl<StoreData | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  stores: StoreData[] | null = null;

  isDisabled: boolean = false;
  isReadOnly: boolean = false;

  async ngAfterViewInit() {
    this.stores = await this.productService.getAllStores();
    if (this.data && this.data.idSellPrice != null) {
      this.action = 2;
      this.titleDialog = 'Alteração';

      const products = await this.productService.getProductSellPrice(
        this.data.idSellPrice
      );
      if (products != undefined) {
        this.inputSellPrice = String(products.price);
        this.selectIdStore = products.id;

        this.isDisabled = !this.isDisabled;
        this.isReadOnly = !this.isReadOnly;
      }
    }
  }

  async saveSellPrice() {
    if (this.selectIdStore != undefined) {
      if (
        this.isValidPrice(parseFloat(this.inputSellPrice)) &&
        !isNaN(parseFloat(this.inputSellPrice))
      ) {
        if (this.data && this.data.idProd != undefined) {
          if (this.action == 1) {
            const searchDuplicity = await this.productService.findProductStore(
              this.data.idProd,
              this.selectIdStore
            );

            if (searchDuplicity == null) {
              const products = await this.productService.addProductStore({
                sell: this.inputSellPrice,
                idProduct: this.data.idProd,
                idStore: this.selectIdStore,
              });
              if (products != undefined) {
                window.location.reload();
              } else {
                this.toastr.error(
                  'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
                  'Valores invalidos'
                );
              }
            } else {
              this.toastr.error(
                'Não é permitido mais que um preço de venda para a mesma loja.',
                'Valor para Loja já existente.'
              );
            }
          } else if (this.action == 2) {
            const products = await this.productService.updateProductStore(
              this.data.idSellPrice,
              {
                sell: this.inputSellPrice,
              }
            );

            if (products == null) {
              window.location.reload();
            } else {
              this.toastr.error(
                'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
                'Valores invalidos'
              );
            }
          } else {
            console.log('Erro, não foi possivel identificar a ação desejada!');
          }
        } else {
          console.log(
            'Erro, não foi possivel localizar o produto selecionado!'
          );
        }
      } else {
        this.toastr.error(
          'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
          'Custo invalido'
        );
      }
    } else {
      this.toastr.error(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        'Loja invalida'
      );
    }
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
