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
  private apiUrlproductstoreDuplicity =
    'http://localhost:3000/productstore/duplicity';
  private apiUrlproductstoreById = 'http://localhost:3000/productstore/byId';
  private apiUrlStore = 'http://localhost:3000/store';

  /**
   * Funcao responsavel por efetuar o cadastro do produto
   * @param productData objeto contendo {desc: string; price: string; image: String | null;}
   * @returns id do produto { id: number } | undefined em caso de erros
   */
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
    } catch (error: any) {
      if (error.status == 413) {
        this.toastr.error('Imagem muito grande', 'Erro ao Enviar imagem');
      } else {
        this.toastr.error(
          'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
          'Erro ao cadastrar produto'
        );
      }
      console.error('Error adding product:', error);
      return;
    }
  }

  /**
   * Adicionar produtoLoja (preço de venda) em loja especifica
   * @param productData objeto contendo {sell: string; idProduct: number; idStore: number;}
   * @returns id do produtoLoja { id: number } | undefined em caso de erros
   */
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

  /**
   * Responsavel por encontrar um produtoLoja (preco de venda) pelo id do produto e id da loja
   * @param idProduct id do produto
   * @param idStore id da loja
   * @returns objeto ProductData[] | null em caso de falhas ou nao encontrar nada
   */
  async findProductStore(
    idProduct: number,
    idStore: number
  ): Promise<ProductData[] | null> {
    try {
      const params = { idProduct: idProduct, idStore: idStore };
      let data: ProductData[] = [];
      const response = await this.http
        .get<ProductData[]>(this.apiUrlproductstoreDuplicity, {
          params: params,
        })
        .toPromise();

      if (response !== undefined) {
        data = response;
      }

      return data;
    } catch (error) {
      return [];
    }
  }

  /**
   * Responsavel por atualizar um cadastro de produto
   * @param id id do produto
   * @param productData objeto contendo {desc: string; price: string; image: String | null;}
   * @returns '{ id: 0 } em caso de erro | undefined em caso de sucesso
   */
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
    } catch (error: any) {
      if (error.status == 413) {
        this.toastr.error('Imagem muito grande', 'Erro ao Enviar imagem');
      } else {
        this.toastr.error(
          'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
          'Erro ao atualizar produto'
        );
      }

      console.error('Error adding product:', error);
      return { id: 0 };
    }
  }

  /**
   * Responsavel por atualizar o produtoLoja (preço de venda)
   * @param id id do produtoLoja
   * @param productData objeto contendo {sell: string;}
   * @returns '{ id: 0 } em caso de erro | undefined em caso de sucesso
   */
  async updateProductStore(
    id: number,
    productData: {
      sell: string;
    }
  ): Promise<{ id: number } | undefined> {
    try {
      const response = await this.http
        .put<{ id: number }>(this.apiUrlproductstore + '/' + id, productData)
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

  /**
   * busca produto pelos filtros desejados
   * @param id id do produto
   * @param desc descrição
   * @param price preco de custo
   * @param sell preço de venda
   * @returns ProductData[] com os produtos encontrados
   */
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

  /**
   * Responsavel por encontrar o produto pelo id
   * @param id id do produto
   * @returns ProductData encontrado | null em caso de erro ou nao encontrar
   */
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

  /**
   * Responsavel por trazer todas as lojas cadastradas
   * @returns StoreData[] | null em caso de erro ou nao encontrar
   */
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

  /**
   * Responsavel por trazer os produtoLoja (preços de venda) de um produto especifico
   * @param id id do produto
   * @returns ProductPriceData[] com os valores encontrados
   */
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

  /**
   * Responsavel por encontrar o preço e a loja de um produtoLoja (preço de venda) especifico
   * @param id id do produtoLoja (preço de venda)
   * @returns objeto { price: string; id: number } sendo o id o id da loja | undefined em caso de erro ou nao encontrado
   */
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

  /**
   * Responsavel por excluir um produto e suas dependencias
   * @param productId id do produto
   * @returns void
   */
  deleteProduct(productId: number): Observable<void> {
    const url = `${this.apiUrlproducts}/${productId}`;
    return this.http.delete<void>(url);
  }

  /**
   * Responsavel por excluir um produtoLoja (Preço de venda)
   * @param productId id do produtoLoja (preço de venda)
   * @returns void
   */
  deleteProductLoja(productId: number): Observable<void> {
    const url = `${this.apiUrlproductstore}/${productId}`;
    return this.http.delete<void>(url);
  }
}
