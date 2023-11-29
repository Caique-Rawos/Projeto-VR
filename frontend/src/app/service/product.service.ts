import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductTableItem } from '../components/product-table/product-table-datasource';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/products';

  async getProducts(): Promise<ProductTableItem[]> {
    try {
      let data: ProductTableItem[] = []; // Inicializa como um array vazio
      const response = await this.http
        .get<ProductTableItem[]>(this.apiUrl)
        .toPromise();

      if (response !== undefined) {
        data = response;
        console.log('Dados recebidos:', data);
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter dados:', error);
      throw error;
    }
  }

  deleteProduct(productId: number): Observable<void> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete<void>(url);
  }
}
