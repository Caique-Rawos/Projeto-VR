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

  insertProduct(productModel: ProductModel): Promise<ProductsEntity> {
    const { desc, price } = productModel;
    const newProduct = new ProductsEntity();
    newProduct.ProductsEntity(desc, price);
    this.productRepository.save(newProduct);
    return;
  }

  getProducts() {
    return this.productRepository.find();
  }

  getSingleProduct(prodId: number) {
    return this.productRepository.findOne({ where: { id: prodId } });
  }

  updateProduct(productId: number, desc: string, price: number) {
    const newProduct = new ProductsEntity();
    newProduct.ProductsEntity(desc, price);
    this.productRepository.update(productId, newProduct);
  }

  deleteProduct(prodId: number) {
    return this.productRepository.delete(prodId);
  }
}
