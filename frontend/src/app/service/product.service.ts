import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductData } from '../components/products-table/products-table.component';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/products';

  async getProductsDataTable(
    id: string,
    desc: string,
    price: string,
    sell: string
  ): Promise<ProductData[]> {
    try {
      const params = { id: id, desc: desc, price: price, sell: sell };
      let data: ProductData[] = [];
      const response = await this.http
        .get<ProductData[]>(this.apiUrl, { params: params })
        .toPromise();

      if (response !== undefined) {
        data = response;
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
