import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrashCan,
  faFloppyDisk,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-products',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatToolbarModule, MatIconModule],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.scss',
})
export class ViewProductsComponent {
  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;
  faCirclePlus = faCirclePlus;
}

export class ToolbarMultirowExample {}
