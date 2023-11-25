import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from './database/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
  ) {}

  private products: ProductModel[] = [];

  insertProduct(title: string, desc: string, price: number): string {
    const prodId = Math.random().toString();
    const newProduct = new ProductModel(prodId, title, desc, price);
    this.products.push(newProduct);
    return prodId;
  }

  getProducts() {
    return [...this.products];
  }

  getSingleProduct(prodId: string) {
    const product = this.findProduct(prodId)[0];
    return { ...product };
  }

  updateProduct(productId: string, title: string, desc: string, price: number) {
    const [product, index] = this.findProduct(productId);
    const updatedProduct = { ...product };
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.desc = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }

    this.products[index] = updatedProduct;
  }

  deleteProduct(prodId: string) {
    const index = this.findProduct(prodId)[1];
    this.products.splice(index, 1);
  }

  private findProduct(id: string): [ProductModel, number] {
    const productIndex = this.products.findIndex((prod) => prod.id === id);
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
}
