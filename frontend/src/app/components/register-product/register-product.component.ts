import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faTrashCan, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss'],
})
export class RegisterProductComponent implements OnInit {
  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;
  productId!: string | null;

  pageActionTitle: string = 'Cadastro';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
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
}
