import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-products',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatToolbarModule, MatIconModule],
  templateUrl: './register-products.component.html',
  styleUrl: './register-products.component.scss',
})
export class RegisterProductsComponent {
  faTrashCan = faTrashCan;
  faFloppyDisk = faFloppyDisk;
}

export class ToolbarMultirowExample {}
