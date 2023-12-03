import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faTrashCan, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { ProductService } from '../../../app/service/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss'],
})
export class RegisterProductComponent implements OnInit {
  @ViewChild(RegisterFormComponent) registerForm!: RegisterFormComponent;

  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;
  productId!: string | null;

  pageActionTitle: string = 'Cadastro';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId != null) {
      if (this.isInteger(this.productId)) {
        this.pageActionTitle = 'Atualização';
      }
    }
  }

  isInteger(value: string): boolean {
    const intValue = parseInt(value, 10);
    return !isNaN(intValue) && Number.isInteger(intValue);
  }

  functionSaveOnRegisterForm() {
    if (this.registerForm) {
      this.registerForm.saveProduct();
    }
  }

  deleteProduct(): void {
    if (this.productId != null) {
      if (confirm(`Deseja mesmo excluir este produto ?`)) {
        this.productService.deleteProduct(parseInt(this.productId)).subscribe(
          () => {
            window.location.reload();
          },
          (error) => {
            console.error('Erro ao excluir produto:', error);
          }
        );
      }
    } else {
      this.toastr.error(
        'Você precisa estar no modo edição para excluir o produto!',
        'Ação invalida!'
      );
    }
  }
}
