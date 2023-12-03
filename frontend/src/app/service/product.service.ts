import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProductData,
  ProductIdPriceData,
  ProductPriceData,
  StoreData,
} from '../interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private apiUrlproducts = 'http://localhost:3000/products';
  private apiUrlproductsById = 'http://localhost:3000/products/byid';
  private apiUrlproductstore = 'http://localhost:3000/productstore';
  private apiUrlproductstoreById = 'http://localhost:3000/productstore/byId';
  private apiUrlStore = 'http://localhost:3000/store';

  async addProduct(productData: {
    desc: string;
    price: string;
    image: String | null;
  }): Promise<{ id: number } | undefined> {
    try {
      const response = await this.http
        .post<{ id: number }>(this.apiUrlproducts, productData)
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error adding product:', error);
      return;
    }
  }

  async addProductStore(productData: {
    sell: string;
    idProduct: number;
    idStore: number;
  }): Promise<{ id: number } | undefined> {
    try {
      const response = await this.http
        .post<{ id: number }>(this.apiUrlproductstore, productData)
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error adding productStore:', error);
      return undefined;
    }
  }

  async findProductStore(
    idProduct: number,
    idStore: number
  ): Promise<ProductData[]> {
    try {
      const params = { idProduct: idProduct, idStore: idStore };
      let data: ProductData[] = [];
      const response = await this.http
        .get<ProductData[]>(this.apiUrlproductstore, { params: params })
        .toPromise();

      if (response !== undefined) {
        data = response;
      }

      return data;
    } catch (error) {
      return [];
    }
  }

  async updateProduct(
    id: number,
    productData: {
      desc: string;
      price: string;
      image: String | null;
    }
  ): Promise<{ id: number } | undefined> {
    try {
      const response = await this.http
        .put<{ id: number }>(this.apiUrlproducts + '/' + id, productData)
        .toPromise();
      return response;
    } catch (error) {
      this.toastr.error(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        'Erro ao atualizar produto'
      );
      console.error('Error adding product:', error);
      return { id: 0 };
    }
  }

  async getProductsDataTable(
    id: string,
    desc: string,
    price: string,
    sell: string
  ): Promise<ProductData[]> {
    try {
      if (!Number.isInteger(Number(id)) || id.includes('.')) {
        return [];
      } else {
        const params = { id: id, desc: desc, price: price, sell: sell };
        let data: ProductData[] = [];
        const response = await this.http
          .get<ProductData[]>(this.apiUrlproducts, { params: params })
          .toPromise();

        if (response !== undefined) {
          data = response;
        }

        return data;
      }
    } catch (error) {
      return [];
    }
  }

  async getProductsById(id: string): Promise<ProductData | null> {
    try {
      if (!Number.isInteger(Number(id)) || id.includes('.')) {
        return null;
      } else {
        const params = { id: id };
        let data: ProductData | null = null;
        const response = await this.http
          .get<ProductData>(this.apiUrlproductsById, { params: params })
          .toPromise();

        if (response !== undefined) {
          data = response;
        }

        return data;
      }
    } catch (error) {
      return null;
    }
  }

  async getAllStores(): Promise<StoreData[] | null> {
    try {
      let data: StoreData[] | null = null;
      const response = await this.http
        .get<StoreData[]>(this.apiUrlStore + '/all')
        .toPromise();

      if (response !== undefined) {
        data = response;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  async getProductsSellPrice(id: string | null): Promise<ProductPriceData[]> {
    try {
      if (id != null) {
        if (Number.isInteger(Number(id)) && !id.includes('.')) {
          const params = { id: id };
          let data: ProductPriceData[] = [];
          const response = await this.http
            .get<ProductPriceData[]>(this.apiUrlproductstore, {
              params: params,
            })
            .toPromise();

          if (response !== undefined) {
            data = response;
          }

          return data;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async getProductSellPrice(
    id: number | null
  ): Promise<{ price: string; id: number } | undefined> {
    try {
      if (id != null) {
        const params = { id: id };
        let data: { price: string; id: number } | undefined = undefined;
        const response = await this.http
          .get<{ price: string; id: number }>(this.apiUrlproductstoreById, {
            params: params,
          })
          .toPromise();

        return response;
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  deleteProduct(productId: number): Observable<void> {
    const url = `${this.apiUrlproducts}/${productId}`;
    return this.http.delete<void>(url);
  }

  deleteProductLoja(productId: number): Observable<void> {
    const url = `${this.apiUrlproductstore}/${productId}`;
    return this.http.delete<void>(url);
  }
}
