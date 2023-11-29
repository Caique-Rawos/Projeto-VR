import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent {
  faPlusCircle = faPlusCircle;
}
