import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ViewProductsComponent } from './components/pages/view-products/view-products.component';
import { RegisterProductsComponent } from './components/pages/register-products/register-products.component';

export const routes: Routes = [
  { path: '', component: ViewProductsComponent },
  { path: 'cadastrar', component: RegisterProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
