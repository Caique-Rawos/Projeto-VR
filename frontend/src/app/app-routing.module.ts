import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { RegisterProductComponent } from './components/register-product/register-product.component';

const routes: Routes = [
  { path: '', component: ViewProductComponent },
  { path: 'cadastro', component: RegisterProductComponent },
  { path: 'cadastro/:id', component: RegisterProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
