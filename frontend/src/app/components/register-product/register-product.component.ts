import { Component } from '@angular/core';
import { faTrashCan, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss'],
})
export class RegisterProductComponent {
  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;
}
